"use strict";

const mongoose = require("mongoose");
const TipoUnidad = require("./tipoUnidadModel");

module.exports.get = function (req, res) {
  TipoUnidad.find({
    $or: [
      { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) },
      { esMaestro: true }
    ]
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  }).lean({ virtuals: true }).then((result) => {
    res.jsonp({ data: result });
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getById = function (req, res) {
  TipoUnidad.findOne({
    _id: req.params.id,
    $or: [
      { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) },
      { esMaestro: true }
    ]
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  }).lean({ virtuals: true }).then((result) => {
    res.jsonp({ data: result });
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  TipoUnidad.find({
    $and: [
      {
        $or: [
          { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) },
          { esMaestro: true }
        ]
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
  }).lean({ virtuals: true }).then((result) => {
    res.jsonp({ data: result });
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getEquivalencias = function (req, res) {
  TipoUnidad.findOne({
    _id: new mongoose.Types.ObjectId(`${req.params.id}`),
    $or: [
      { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) },
      { esMaestro: true }
    ]
  }).populate({
    path: 'equivalencias.to',
    select: 'nombre',
    model: 'TipoUnidad'
  }).lean({ virtuals: true }).then((result) => {
    if (result) {
      res.jsonp({ data: result.equivalencias || [] })
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getDesplegable = function (req, res) {
  TipoUnidad.aggregate([
    {
      $match: {
        $or: [
          { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) },
          { esMaestro: true }
        ]
      }
    },
    {
      "$project": {
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.insert = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`);
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
  const TipoUnidadEquivalencia = require('../tipoUnidadEquivalencia/tipoUnidadEquivalenciaModel');

  Articulo.find({
    tiposUnidad: { $all: [new mongoose.Types.ObjectId(`${tipoUnidadId}`)] }
  }).then((result) => {
    if (result.length > 0) {
      TipoUnidadEquivalencia.findOne({
        $or: [
          { from: tipoUnidadId },
          { to: tipoUnidadId },
        ],
      }).then(result => {
        if (result) {
          res.status(409).send({ respuesta: 409, message: "El tipo de unidad está en uso" });
        } else {
          TipoUnidad.deleteOne({ _id: req.params.id })
            .then((result) => {
              if (result) {
                res.jsonp({ data: result });
              } else {
                res.status(500).send({ message: "TipoUnidad con id " + req.params.id + " no existe" });
              }
            })
            .catch((error) => res.status(500).send({ message: error.message }));
        }
      })
    } else {
      res.status(409).send({ respuesta: 409, message: "El tipo de unidad está en uso" });
    }
  })
    .catch((error) => res.status(500).send({ message: error.message }));
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