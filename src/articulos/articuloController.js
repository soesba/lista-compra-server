'use strict';

var mongoose = require("mongoose");
const Articulo = require('./articuloModel');

module.exports.get = function(req, res) {
    Articulo.find()
    .then(result => res.jsonp(result))
        .catch(error => res.status(500).send({message: error}));;
};

module.exports.getById = function(req, res) {    
    Articulo.findOne({'_id': req.params.id})
        .then(result => {
          res.jsonp(result);
        })
        .catch(error => res.status(500).send({message: error}));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  Articulo.find({
      $or: [
      { nombre: { $regex: texto, $options: "i" } },
      { descripcion: { $regex: texto, $options: "i" } },
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
    const articulo = new Articulo(req.body);
    Articulo.findOne({nombre: articulo.nombre })
      .then((u) => {
        if (u) {
          res.status(409).send({
            respuesta: 409,
            message: "Ya existe un registro con ese nombre",
          });
        } else {
          articulo.save().then((response) => {
            if (response) {
              res.jsonp(response);
            } else {
              res.status(500).send({
                message: "Error al crear el registro de articulo",
              });
            }
          });
        }
      })
      .catch((error) => res.status(500).send({ message: error }));
  };
  
  module.exports.update = function(req, res) {    
      console.log("🚀 ~ req, res:", req, res)
      Articulo.findOneAndUpdate( 
          { _id:  mongoose.Types.ObjectId(req.body.id)},
          { $set: { nombre: req.body.nombre, descripcion: req.body.descripcion } },
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

module.exports.delete = function(req, res) {
Articulo.deleteOne({'_id': req.params.id})
    .then(result => {
        if (result) {
            res.jsonp(result);                
        }else {
            res.status(500).send({message: 'Articulo con id ' + req.params.id + ' no existe'});
        }
    })
    .catch(error => res.status(500).send({message: error}));
};