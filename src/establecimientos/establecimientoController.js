"use strict";

var mongoose = require("mongoose");
const Establecimiento = require("./establecimientoModel");

module.exports.get = function (req, res) {
  // NOTA: si usamos aggregate no se ejecuta la transformacion toJSON del model
  // Establecimiento.aggregate([
  //   { $lookup: {
  //     from: "TipoEstablecimiento",
  //     localField: "tipoEstablecimiento",
  //     foreignField: "_id",
  //     as: "tipoEstablecimiento"
  //   }}
  // ]).then((result) => {
  //   result.forEach(item => {
  //     item.id = item._id
  //     if (item.tipoEstablecimiento.length !== 0){
  //       const tipoEstablecimiento = item.tipoEstablecimiento[0]
  //       item.tipoEstablecimiento = tipoEstablecimiento
  //     }
  //   })
  //   res.jsonp(result)
  // }).catch((error) => res.status(500).send({ message: error.message }));
  Establecimiento.find()
    .populate('tipoEstablecimiento')
    .then((result) => res.jsonp({ data: result }))
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getById = function (req, res) {
    Establecimiento.findOne({ _id: req.params.id })
    .populate('tipoEstablecimiento')
    .then((result) => {
        res.jsonp({ data: result });
    })
    .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  Establecimiento.find({
    $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { tipoEstablecimiento: { $regex: texto, $options: "i" } },
    ],
  })
  .populate('tipoEstablecimiento')
  .then((result) => {
    if (result) {
      res.jsonp({ data: result });
    }
  })
  .catch((error) => res.status(500).send({ message: error.message }));
};

module.exports.getDesplegable = function (req, res) {
  Establecimiento.aggregate([
    {
      "$project":{
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.insert = function (req, res) {
  req.body.direcciones =  req.body.direcciones.map(element => {
    if (!element._id) {
      element._id =  mongoose.Types.ObjectId()
    }
    return element
  });
  const establecimiento = new Establecimiento(req.body);
  Establecimiento.findOne({
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
    // const imageData = req.body.logo;
    // const imageBuffer = Buffer.from(imageData.content, "base64");
    req.body.direcciones =  req.body.direcciones.map(element => {
      if (!element._id) {
        element._id =  mongoose.Types.ObjectId()
      }
      return element
    });
    Establecimiento.findOneAndUpdate(
      { _id:  new mongoose.Types.ObjectId(`${req.body.id}`) },
      { $set: { nombre: req.body.nombre, abreviatura: req.body.abreviatura, logo: req.body.logo, direcciones: req.body.direcciones, tipoEstablecimiento: req.body.tipoEstablecimiento } },
      { new: true }).then(result => {
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