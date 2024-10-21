"use strict";

var mongoose = require("mongoose");
const TipoUnidad = require("./tipoUnidadModel");

module.exports.get = function (req, res) {
  TipoUnidad.find()
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getById = function (req, res) {
  TipoUnidad.findOne({ _id: req.params.id })
    .then((result) => {
        res.jsonp(result);
    })
    .catch((error) => res.status(500).send({ message: error }));
};

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto);
  TipoUnidad.find({
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

module.exports.getDesplegable = function (req, res) {
  TipoUnidad.aggregate([
    {
      "$project":{
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
      if (result) {
        res.jsonp(result)
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.insert = function (req, res) {
  req.body.equivalencias =  req.body.equivalencias.map(element => {
    if (!element._id) {
      element._id =  mongoose.Types.ObjectId()
    }
    return element
  });   
  const tipoUnidad = new TipoUnidad(req.body);  
  TipoUnidad.findOne({
    $or: [
      { nombre: tipoUnidad.nombre },
      { abreviatura: tipoUnidad.abreviatura },
      { equivalencias: tipoUnidad.equivalencias }
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
    req.body.equivalencias =  req.body.equivalencias.map(element => {
      if (!element._id) {
        element._id =  mongoose.Types.ObjectId()
      }
      return element
    });
    TipoUnidad.findOneAndUpdate( 
        { _id:  mongoose.Types.ObjectId(req.body.id)},
        { $set: { nombre: req.body.nombre, abreviatura: req.body.abreviatura, equivalencias: req.body.equivalencias } },
        { useFindAndModify: false, returnNewDocument: true },
        (err, result) => {
            if (err) {
                return res.status(500).send({message: err + " en tipo de unidad"})
            } else {
                res.jsonp(result)
            }
        }
    )
}

module.exports.delete = function (req, res) {
  const tipoUnidadId = req.params.id
  const Articulo = require("../articulos/articuloModel");
  const TipoUnidadEquivalencia = require('../tipoUnidadEquivalencia/tipoUnidadEquivalenciaModel');
  
  Articulo.find({ 
    tiposUnidad: { $all: [mongoose.Types.ObjectId(tipoUnidadId)]   } 
  }).then((result) => {
    if (result.length !== 0) {
      res.status(409).send({ respuesta: 409, message: "El tipo de unidad está en uso" });
    } else {
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
              res.jsonp(result);
            } else {
              res.status(500).send({ message: "TipoUnidad con id " + req.params.id + " no existe" });
            }
          })
          .catch((error) => res.status(500).send({ message: error }));
        }
      })
    }
  })
  .catch((error) => res.status(500).send({ message: error }));  
};