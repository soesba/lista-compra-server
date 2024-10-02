'use strict'

var mongoose = require('mongoose')
const Articulo = require('./articuloModel')

module.exports.get = function (req, res) {
  Articulo.find()
    .populate('tiposUnidad')
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.getById = function (req, res) {
  Articulo.findOne({ _id: req.params.id })
    .populate('tiposUnidad')
    .then((result) => {
      res.jsonp(result)
    })
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.getByAny = function (req, res) {
  const texto = new RegExp(req.params.texto)
  Articulo.find({
    $or: [
      { nombre: { $regex: texto, $options: 'i' } },
      { descripcion: { $regex: texto, $options: 'i' } },
    ],
  })
    .populate('tiposUnidad')
    .then((result) => {
      if (result) {
        res.jsonp(result)
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.getDesplegable = function (req, res) {
  Articulo.aggregate([
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
  const articulo = new Articulo(req.body)
  Articulo.findOne({ nombre: articulo.nombre })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: 'Ya existe un registro con ese nombre',
        })
      } else {
        articulo.save({returnNewDocument: true }, (err, result) => {
          if (err) {
            res.status(500).send({ message: 'Error al crear el registro de articulo' })
          } else {
            res.jsonp(result);
          }
        })
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.update = function (req, res) {
  const tiposUnidad = req.body.tiposUnidad.map(item => {
    item._id = mongoose.Types.ObjectId(item.id)
    return item
  })

  Articulo.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.id) },
    {
      $set: {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        tiposUnidad: tiposUnidad,
      },
    },
    { useFindAndModify: false, returnNewDocument: true },
    (err, result) => {
      if (err) {
        return res.status(500).send({ message: err + ' en Articulo' })
      } else {
        res.jsonp(result)
      }
    }
  )
}

module.exports.delete = function (req, res) {
  Articulo.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result)
      } else {
        res
          .status(500)
          .send({ message: 'Articulo con id ' + req.params.id + ' no existe' })
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}
