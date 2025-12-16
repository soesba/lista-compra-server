"use strict";

const mongoose = require("mongoose");
const Establecimiento = require("./establecimientoModel");

module.exports.get = function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
  Establecimiento.find({ usuario: new mongoose.Types.ObjectId(`${req.user.id}`) })
    .populate('tipoEstablecimiento')
    .sort({ [orderBy]: direction, fechaCreacion: 1 })
    .then((result) => res.jsonp({ data: result.map(item => item.toJSON()) }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getById = function (req, res) {
    Establecimiento.findOne({ _id: req.params.id, usuario: new mongoose.Types.ObjectId(`${req.user.id}`) })
    .populate('tipoEstablecimiento')
    .then((result) => {
        res.jsonp({ data: result.toJSON() });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getByAny = function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
  const texto = new RegExp(req.params.texto);
  Establecimiento.find({
    usuario: new mongoose.Types.ObjectId(`${req.user.id}`),
    $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { tipoEstablecimiento: { $regex: texto, $options: "i" } },
    ],
  })
  .populate('tipoEstablecimiento')
  .sort({ [orderBy]: direction, fechaCreacion: 1 })
  .then((result) => {
    if (result) {
      res.jsonp({ data: result.map(item => item.toJSON()) });
    }
  })
  .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getDesplegable = function (req, res) {
  Establecimiento.aggregate([
    {
      $match: { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) }
    },
    {
      "$project":{
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
  }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.insert = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`);
  // req.body.direcciones =  req.body.direcciones.map(element => {
  //   if (!element._id) {
  //     element._id =  mongoose.Types.ObjectId()
  //   }
  //   return element
  // });
  const establecimiento = new Establecimiento(req.body);
  Establecimiento.findOne({
    usuario: new mongoose.Types.ObjectId(`${req.user.id}`),
    $and: [
      { nombre: establecimiento.nombre },
      { tipoEstablecimiento: establecimiento.tipoEstablecimiento },
    ],
  }).then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con los datos introducidos",
        });
      } else {
        establecimiento.save().then((response) => {
          if (response) {
            res.jsonp({ data: response });
          } else {
            res.status(500).send({
              message: "Error al crear el registro de establecimiento",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.update = function(req, res) {
    req.body.direcciones =  req.body.direcciones.map(element => {
      if (!element.id) {
        element._id = new mongoose.Types.ObjectId()
      }
      return element
    });
    req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`);
    const establecimiento = new Establecimiento(req.body);
    Establecimiento.findOneAndUpdate(
      { _id:  new mongoose.Types.ObjectId(`${req.body.id}`) },
      { $set: establecimiento },
      { new: true,  runValidators: true }).then(result => {
          if (result) {
              res.jsonp({ data: result })
          } else {
              res.status(500).send({ message: 'Error al actualizar el registro de establecimiento' })
          }
      }).catch((error) => res.status(500).send({ message: error.message }));
}

module.exports.delete = function (req, res) {
  Establecimiento.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp({ data: result });
      } else {
        res.status(500).send({
          message: "Establecimiento con id " + req.params.id + " no existe",
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.checkData = async function (req, res) {
  const checkModule = require('../utils/checkConsistencia.js');
  const resultado = await checkModule.checkDataConsistencyEstablecimiento();
  res.jsonp({ data: resultado });
}