'use strict'

const mongoose = require('mongoose')
const Articulo = require('./articuloModel')

module.exports.get = async function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
  const articulos = await Articulo.find({ usuario: new mongoose.Types.ObjectId(`${req.user.id}`) }).lean();
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
  ]).sort({ [orderBy]: direction, fechaCreacion: 1 }).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.getById = async function (req, res) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  Articulo.aggregate([
    {
      $match: { _id: id, usuario: new mongoose.Types.ObjectId(`${req.user.id}`) } // Filtrar por id
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
  }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.getByAny = function (req, res) {
  const orderBy = req.query.orderBy || 'nombre'; // Campo por defecto
  const direction = req.query.direction === 'desc' ? -1 : 1; // 1 para asc, -1 para desc
  const texto = new RegExp(req.params.texto)
  Articulo.find({
    usuario: new mongoose.Types.ObjectId(`${req.user.id}`),
    $or: [
      { nombre: { $regex: texto, $options: 'i' } },
      { descripcion: { $regex: texto, $options: 'i' } },
    ],
  })
    .populate('tiposUnidad')
    .sort({ [orderBy]: direction, fechaCreacion: 1 })
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
      $match: { usuario: new mongoose.Types.ObjectId(`${req.user.id}`) }
    },
    {
      "$project": {
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).sort({ nombre: 1 }).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.insert = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`)
  const articulo = new Articulo(req.body)
  Articulo.findOne({ nombre: articulo.nombre, usuario: new mongoose.Types.ObjectId(`${req.user.id}`) })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: 'Ya existe un registro con ese nombre',
        })
      } else {
        articulo.save({ new: true }).then(result => {
          res.jsonp({ data: result });
        }).catch((error) => res.status(500).send({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.update = function (req, res) {
  const tiposUnidad = req.body.tiposUnidad.map(item => {
    item = new mongoose.Types.ObjectId(`${item}`)
    return item
  })

  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`)
  req.body.tiposUnidad = tiposUnidad
  const articulo = new Articulo(req.body)

  Articulo.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${req.body.id}`) },
    {
      $set: articulo,
    },
    { new: true,  runValidators: true }).then(result => {
      if (result) {
        res.jsonp({ data: result })
      } else {
        res.status(500).send({ message: 'Error al actualizar el registro de articulo' })
      }
    }).catch((error) => res.status(500).send({ message: error.message }));
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

module.exports.checkData = async function (req, res) {
  const checkModule = require('../utils/checkConsistencia.js');
  const resultado = await checkModule.checkDataConsistencyArticulo();
  res.jsonp({ data: resultado });
}