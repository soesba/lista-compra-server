"use strict";

const mongoose = require("mongoose");
const TipoUnidad = require("./tipoUnidadModel");

module.exports.get = function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
   TipoUnidad.find({
   ...req.accessFilter
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  })
  .sort({ [orderBy]: direction, fechaCreacion: 1 })
    .then((result) => {
    res.jsonp({ data: result.map(item => item.toJSON()) });
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getById = function (req, res) {
  TipoUnidad.findOne({
    _id: req.params.id,
    ...req.accessFilter
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  })
  .then((result) => {
    res.jsonp({ data: result.toJSON() });
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getByAny = function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
  const texto = new RegExp(req.params.texto);
  TipoUnidad.find({
    $and: [
      {
        ...req.accessFilter
      },
      {
        $or: [
          { nombre: { $regex: texto, $options: "i" } },
          { abreviatura: { $regex: texto, $options: "i" } },
        ]
      }]
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  })
    .sort({ [orderBy]: direction, fechaCreacion: 1 })
    .then((result) => {
      res.jsonp({ data: result.map(item => item.toJSON()) });
    }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getEquivalencias = function (req, res) {
  TipoUnidad.findOne({
    _id: new mongoose.Types.ObjectId(`${req.params.id}`),
    ...req.accessFilter
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  }).then((result) => {
    if (result) {
      res.jsonp({ data: result.equivalencias ? result.equivalencias.map(item => item.toJSON()) : []});
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getDesplegable = function (req, res) {
  TipoUnidad.aggregate([
    {
      $match: {
        ...req.accessFilter
      }
    },
    {
      "$project": {
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ])
    .sort({ nombre: 1 })
    .then((result) => {
      if (result) {
        res.jsonp({ data: result })
      }
    }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.insert = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`);
  req.body.equivalencias.forEach(eq => {
    eq.to = new mongoose.Types.ObjectId(`${eq.to.id}`);
    delete eq.id;
  });
  const tipoUnidad = new TipoUnidad(req.body);
  TipoUnidad.findOne({
    usuario: new mongoose.Types.ObjectId(`${req.user.id}`),
    $or: [
      { nombre: tipoUnidad.nombre },
      { abreviatura: tipoUnidad.abreviatura }
    ],
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con alguno de los datos introducidos",
        });
      } else {
        tipoUnidad.save().then((response) => {
          if (response) {
            res.jsonp({ data: response });
          } else {
            res.status(500).send({
              message: "Error al crear el registro de tipo de unidad",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.update = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`);
  req.body.equivalencias.forEach(eq => {
    eq.to = new mongoose.Types.ObjectId(`${eq.to.id}`);
    delete eq.id;
  });
  const tipoUnidad = new TipoUnidad(req.body);
  TipoUnidad.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${req.body.id}`) },
    { $set: tipoUnidad },
    { new: true, runValidators: true }).then(result => {
      if (result) {
        res.jsonp({ data: result });
      } else {
        res.status(500).send({ message: "Error al actualizar el registro de tipo de unidad" });
      }
    }).catch((error) => res.status(500).send({ message: error.message }));
}

module.exports.delete = function (req, res) {
  const tipoUnidadId = req.params.id
  const Articulo = require("../articulos/articuloModel");

  Articulo.find({
    tiposUnidad: { $all: [new mongoose.Types.ObjectId(`${tipoUnidadId}`)] }
  }).then((result) => {
    if (result.length === 0) {
      TipoUnidad.exists({ "equivalencias.to": new mongoose.Types.ObjectId(`${tipoUnidadId}`) }).then(equivalenciaResult => {
        if (equivalenciaResult) {
          res.status(409).send({ respuesta: 409, message: "La unidad de medida está en uso" });
        } else {
          TipoUnidad.deleteOne({ _id: req.params.id }).then((result) => {
            if (result) {
              res.jsonp({ data: result });
            } else {
              res.status(500).send({ message: "TipoUnidad con id " + req.params.id + " no existe" });
            }
          }).catch((error) => res.status(500).send({ message: error.message }));
        }
      }).catch((error) => res.status(500).send({ message: error.message }));
    } else {
      res.status(409).send({ respuesta: 409, message: "La unidad de medida está en uso" });
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.checkUso = function (req, res) {
  const tipoUnidadId = req.params.id;
  const checkUsoTipoUnidad = require('../utils/checkUso').checkUsoTipoUnidad;

  checkUsoTipoUnidad(tipoUnidadId)
    .then(resultados => {
      res.jsonp({ data: resultados });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};

module.exports.checkData = async function (req, res) {
  const checkModule = require('../utils/checkConsistencia.js');
  const resultado = await checkModule.checkDataConsistencyTipoUnidad();
  res.jsonp({ data: resultado });
};