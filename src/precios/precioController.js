"use strict";

var mongoose = require("mongoose");
const Precio = require("./precioModel");

module.exports.get = function (req, res) {
  Precio.find()
    .populate("establecimiento", "_id nombre")
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  Precio.findOne({ _id: req.params.id })
    .populate("establecimiento", "_id nombre")
    .then((result) => {
      res.jsonp(result);
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  Precio.find({
    $or: [
      { marca: { $regex: texto, $options: "i" } }
    ],
  }).populate("establecimiento", "_id nombre")
    .then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.insert = function (req, res) {
  const precio = new Precio(req.body);
  Precio.findOne({ articulo: precio.articulo, marca: precio.marca, establecimiento: precio.establecimiento, fechaCompra: precio.fechaCompra })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con esos datos",
        });
      } else {
        precio.save().then((response) => {
          if (response) {
            res.jsonp(response);
          } else {
            res.status(500).send({
              message: "Error al crear el registro de precio",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.update = function (req, res) {
  if (req.body.unidadesMedida.length !== 0) {
    req.body.unidadesMedida = req.body.unidadesMedida.map(item => {
      item._id = mongoose.Types.ObjectId(item.id)
      return item
    })
  }
  Precio.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.id) },
    { $set: req.body },
    { useFindAndModify: false, returnNewDocument: true, returnOriginal: false },
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: err + " en Precio" });
      } else {
        res.jsonp(result);
      }
    }
  );
};

module.exports.delete = function (req, res) {
  Precio.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res
          .status(500)
          .send({ message: "Precio con id " + req.params.id + " no existe" });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};
