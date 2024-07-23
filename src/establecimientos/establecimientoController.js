"use strict";

var mongoose = require("mongoose");
const Establecimiento = require("./establecimientoModel");

module.exports.get = function (req, res) {
  Establecimiento.aggregate([
    { $lookup: {
      from: "TipoEstablecimiento",
      localField: "tipoEstablecimiento",
      foreignField: "_id",
      as: "tipoEstablecimiento"
    }}
  ]).then((result) => {
    result.forEach(item => {
      if (item.tipoEstablecimiento.length !== 0){
        const tipoEstablecimiento = item.tipoEstablecimiento[0]
        item.tipoEstablecimiento = tipoEstablecimiento
      }
    })
    res.jsonp(result)
  }).catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  Establecimiento.aggregate([
    { $match: { _id: req.params.id } },
    { $lookup: {
      from: "TipoEstablecimiento",
      localField: "tipoEstablecimiento",
      foreignField: "_id",
      as: "tipoEstablecimiento"
    }}])
    .then((result) => {
      if (result.length !== 0 && result[0].tipoEstablecimiento.length !== 0) {
        const tipoEstablecimiento = result[0].tipoEstablecimiento[0]
        result[0].tipoEstablecimiento = tipoEstablecimiento
      }
      res.jsonp(result);
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  Establecimiento.find({
    $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { abreviatura: { $regex: texto, $options: "i" } },
    ],
  })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.insert = function (req, res) {
  const establecimiento = new Establecimiento(req.body);
  Establecimiento.findOne({
    $or: [
      { nombre: establecimiento.nombre },
      { abreviatura: establecimiento.abreviatura },
    ],
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con alguno de los datos introducidos",
        });
      } else {
        establecimiento.save().then((response) => {
          if (response) {
            res.jsonp(response);
          } else {
            res.status(500).send({
              message: "Error al crear el registro de establecimiento",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.update = function(req, res) {    
    console.log("🚀 ~ req, res:", req, res)
    Establecimiento.findOneAndUpdate( 
        { _id:  mongoose.Types.ObjectId(req.body.id)},
        { $set: { nombre: req.body.nombre, abreviatura: req.body.abreviatura } },
        { useFindAndModify: false, returnNewDocument: true },
        (err, result) => {
            if (err) {
                return res.status(500).send({message: err + " en Establecimiento"})
            } else {
                res.jsonp(result)
            }
        }
    )
}

module.exports.delete = function (req, res) {
  Establecimiento.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({
          message: "Establecimiento con id " + req.params.id + " no existe",
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};
