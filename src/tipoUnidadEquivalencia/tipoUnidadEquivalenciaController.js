"use strict";

var mongoose = require("mongoose");
const TipoUnidadEquivalencia = require("./tipoUnidadEquivalenciaModel");

module.exports.get = function (req, res) {
  TipoUnidadEquivalencia.find()
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  TipoUnidadEquivalencia.findOne({ _id: req.params.id })
    .then((result) => {
        res.jsonp(result);
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByFrom = function (req, res) {
  TipoUnidadEquivalencia.find({ from: req.params.from })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByFromMultiple = function (req, res) {
  const fromToObjectId = req.params.from.split(',').map(x =>
    mongoose.Types.ObjectId(x)
  )
  TipoUnidadEquivalencia.find({
    from: { $in: fromToObjectId }
  }).then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  TipoUnidadEquivalencia.find({
    $or: [
      { from: req.params.id },
      { to: req.params.id },
    ],
  }).then((result) => {
      if (result) {
        res.jsonp(result);
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.save = function (req, res) {
  const operaciones = req.body.map(op => {
    if (op.id) {
      if (op.markedForDeletion) {
        // Eliminar si tiene _id y está marcado para borrado
        return {
          deleteOne: {
            filter: { _id: op.id }
          }
        };
      } else {
        // Actualizar si existe
        delete op.markedForDeletion; // Eliminar la propiedad para evitar problemas en la actualización
        return {
          updateOne: {
            filter: { _id: op.id },
            update: { $set: op }
          }
        };
      }
    } else {
      // Insertar si no tiene _id
      delete op.markedForDeletion; // Eliminar la propiedad para evitar problemas en la inserción
      return {
        insertOne: {
          document: op
        }
      };
    }
  });
  TipoUnidadEquivalencia.bulkWrite(operaciones)
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({ message: "Error al guardar las equivalencias" });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
}

module.exports.insert = function (req, res) {
  const tipoUnidadEquivalencia = new TipoUnidadEquivalencia(req.body);
  TipoUnidadEquivalencia.findOne({
    $and: [
      { from: tipoUnidadEquivalencia.from },
      { to: tipoUnidadEquivalencia.to },
    ],
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: "Ya existe un registro con los datos introducidos",
        });
      } else {
        tipoUnidadEquivalencia.save().then((response) => {
          if (response) {
            res.jsonp(response);
          } else {
            res.status(500).send({
              message: "Error al crear el registro de equivalencias",
            });
          }
        });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.update = function(req, res) {
  TipoUnidadEquivalencia.findOneAndUpdate(
      { _id:  mongoose.Types.ObjectId(req.body.id)},
      { $set: { from: req.body.from, to: req.body.to, factor: req.body.factor } },
      { useFindAndModify: false, returnNewDocument: true },
      (err, result) => {
          if (err) {
              return res.status(500).send({message: err + " en Equivalencias"})
          } else {
              res.jsonp(result)
          }
      }
  )
}

module.exports.delete = function (req, res) {
  TipoUnidadEquivalencia.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result);
      } else {
        res.status(500).send({ message: "Equivalencia con id " + req.params.id + " no existe" });
      }
    })
    .catch((error) => res.status(500).send({ message: error }));
};