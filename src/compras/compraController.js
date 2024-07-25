"use strict";

var mongoose = require("mongoose");
const Compra = require("./compraModel");

module.exports.get = function (req, res) {
  Compra.find()
    .populate("establecimiento")
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  Compra.findOne({ _id: req.params.id })
    .populate("establecimiento")
    .then((result) => {
      res.jsonp(result);
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  Compra.find({
    $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { descripcion: { $regex: texto, $options: "i" } },
    ],
  })
    .populate("establecimiento")
    .then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.insert = function (req, res) {
  const compra = new Compra(req.body);
  Compra.findOne({ nombre: compra.nombre })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con ese nombre",
        });
      } else {
        compra.save().then((response) => {
          if (response) {
            res.jsonp(response);
          } else {
            res.status(500).send({
              message: "Error al crear el registro de compra",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.update = function (req, res) {
  Compra.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.id) },
    { $set: { nombre: req.body.nombre, descripcion: req.body.descripcion, tiposUnidad: req.body.tiposUnidad } },
    { useFindAndModify: false, returnNewDocument: true },
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: err + " en Compra" });
      } else {
        res.jsonp(result);
      }
    }
  );
};

module.exports.delete = function (req, res) {
  Compra.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res
          .status(500)
          .send({ message: "Compra con id " + req.params.id + " no existe" });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};
