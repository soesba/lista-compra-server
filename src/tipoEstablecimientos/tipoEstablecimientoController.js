"use strict";

var mongoose = require("mongoose");
const TipoEstablecimiento = require("./tipoEstablecimientoModel");

module.exports.get = function (req, res) {
  TipoEstablecimiento.find()
    .then((result) => res.jsonp({ data: result }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getById = function (req, res) {
  TipoEstablecimiento.findOne({ _id: req.params.id })
    .then((result) => {
      res.jsonp({ data: result });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  TipoEstablecimiento.find({
    $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { abreviatura: { $regex: texto, $options: "i" } },
    ],
  })
    .then((result) => {
      if (result) {
        res.jsonp({ data: result });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getDesplegable = function (req, res) {
  TipoEstablecimiento.aggregate([
    {
      "$project":{
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
      if (result) {
        res.jsonp({ data: result });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.insert = function (req, res) {
  const tipoEstablecimiento = new TipoEstablecimiento(req.body);
  TipoEstablecimiento.findOne({
    $and: [
      { nombre: tipoEstablecimiento.nombre },
      { abreviatura: tipoEstablecimiento.abreviatura },
    ],
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con los datos introducidos",
        });
      } else {
        tipoEstablecimiento.save().then((response) => {
          if (response) {
            res.jsonp({ data: response });
          } else {
            res.status(500).send({
              message: "Error al crear el registro de tipo de establecimiento",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.update = function (req, res) {
  TipoEstablecimiento.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.id) },
    { $set: { nombre: req.body.nombre, abreviatura: req.body.abreviatura } },
    { useFindAndModify: false, returnNewDocument: true },
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: err + " en Tipo Establecimiento" });
      } else {
        res.jsonp({ data: result });
      }
    }
  );
};

module.exports.delete = function (req, res) {
  const tipoEstablecimientoId = req.params.id
  const Establecimiento = require("../establecimientos/establecimientoModel");
  Establecimiento.find({
    tipoEstablecimiento: { $all: [mongoose.Types.ObjectId(tipoEstablecimientoId)] }
  }).then(result => {
    if (result.length !== 0) {
      res.status(409).send({ respuesta: 409, message: "El tipo de establecimiento está en uso" });
    } else {
      TipoEstablecimiento.deleteOne({ _id: req.params.id }).then((result) => {
        if (result) {
          res.jsonp({ data: result });
        } else {
          res.status(500).send({
            message: "TipoEstablecimiento con id " + req.params.id + " no existe",
          });
        }
      }).catch((error) => res.status(500).send({ message: error.message }));
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};
