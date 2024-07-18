"use strict";

var mongoose = require("mongoose");
const TipoUnidad = require("./tipoUnidadModel");
const { result } = require("lodash");

module.exports.get = function (req, res) {
  TipoUnidad.find()
    .then((c) => res.jsonp(c))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  TipoUnidad.findOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({
          message: "TipoUnidad con id " + req.params.id + " no existe",
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  TipoUnidad.find({
    $or: [
      { $text: { $search: req.params.texto } },
      { nombre: { $regex: texto, $options: "i" } },
      { abreviatura: { $regex: texto, $options: "i" } },
    ],
  })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({
          message:
            "TipoUnidad con algún campo " + req.params.texto + " no existe",
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.insert = function (req, res) {
  const tipoUnidad = new TipoUnidad(req.body);
  TipoUnidad.findOne({
    $or: [
      { nombre: tipoUnidad.nombre },
      { abreviatura: tipoUnidad.abreviatura },
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
            res.jsonp(response);
          } else {
            res.status(500).send({
              message: "Error al crear el registro de tipo de unidad",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.update = function(req, res) {    
    console.log("🚀 ~ req, res:", req, res)
    TipoUnidad.findOneAndUpdate( 
        { _id:  mongoose.Types.ObjectId(req.body._id)},
        { $set: { nombre: req.body.nombre, abreviatura: req.body.abreviatura } },
        { useFindAndModify: false, returnNewDocument: true },
        (err, result) => {
            if (err) {
                return res.status(500).send({message: err + " en Tipo Unidad"})
            } else {
                res.jsonp(result)
            }
        }
    )
}

module.exports.delete = function (req, res) {
  TipoUnidad.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({
          message: "TipoUnidad con id " + req.params.id + " no existe",
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};
