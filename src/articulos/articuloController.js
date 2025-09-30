'use strict'

var mongoose = require('mongoose')
const Articulo = require('./articuloModel')

module.exports.get = async function (req, res) {
  const articulos = await Articulo.find().lean();
  Articulo.aggregate([
    {
      $match: { _id: { $in: articulos.map(p => p._id) } } // Filtrar por los pedidos encontrados
    },
    {
      $lookup: {
        from: 'Precio',
        localField: '_id',
        foreignField: 'articulo',
        as: 'itemsRelacionados'
      }
    },
    {
      $addFields: {
        tienePrecios: { $gt: [{ $size: "$itemsRelacionados" }, 0] }, // `true` si el tamaño es mayor que 0
        id: "$_id"
      }
    },
    {
      $project: {
        itemsRelacionados: 0,  // Opcional: Ocultar el arreglo de items relacionados,
        _id: 0
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.getById = async function (req, res) {
  Articulo.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) } // Filtrar por id
    },
    {
      $lookup: {
        from: 'Precio',
        localField: '_id',
        foreignField: 'articulo',
        as: 'itemsRelacionados'
      }
    },
    {
      $lookup: {
        from: 'TipoUnidad',
        let: { tiposUnidadIds: '$tiposUnidad' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$_id', '$$tiposUnidadIds']
              }
            }
          },
          {
            $addFields: {
              id: '$_id'
            }
          }
        ],
        as: 'tiposUnidad'
      }
    },
    {
      $addFields: {
        tienePrecios: { $gt: [{ $size: "$itemsRelacionados" }, 0] }, // `true` si el tamaño es mayor que 0
        id: "$_id"
      }
    },
    {
      $project: {
        itemsRelacionados: 0,  // Opcional: Ocultar el arreglo de items relacionados,
        _id: 0
      }
    }
  ]).then((result) => {
    if (result[0]) {
      res.jsonp({ data: result[0] })
    }
  })
    .catch((error) => res.status(500).send({ message: error.message }))
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
        res.jsonp({ data: result })
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.getDesplegable = function (req, res) {
  Articulo.aggregate([
    {
      "$project": {
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  })
    .catch((error) => res.status(500).send({ message: error.message }))
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
        articulo.save({ returnNewDocument: true }, (err, result) => {
          if (err) {
            res.status(500).send({ message: 'Error al crear el registro de articulo' })
          } else {
            res.jsonp({ data: result });
          }
        })
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.update = function (req, res) {
  const tiposUnidad = req.body.tiposUnidad.map(item => {
    item = mongoose.Types.ObjectId(item)
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
        res.jsonp({ data: result })
      }
    }
  )
}

module.exports.delete = function (req, res) {
  Articulo.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp({ data: result })
      } else {
        res
          .status(500)
          .send({ message: 'Articulo con id ' + req.params.id + ' no existe' })
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}
