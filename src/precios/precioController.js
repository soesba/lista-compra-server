'use strict'

var mongoose = require('mongoose')
const Precio = require('./precioModel')

module.exports.get = async function (req, res) {
  // const primerFiltro = await Precio.aggregate([
  //   { $group: { _id: "$articulo", doc:{ "$first": "$$ROOT" }}},
  //   { $replaceRoot: { newRoot: "$doc" }},
  //   { $addFields: { id: '$_id' } }
  // ])
  // Precio.populate(primerFiltro, { path: "establecimiento", select: { _id:1, nombre: 1 }}, (err, segundoFiltro) => {
  //   Precio.populate(segundoFiltro, { path: "articulo", select: { _id:1, nombre: 1 }}, (err, result) => {
  //     if (err) {
  //       res.status(500).send({ message: error });
  //     }
  //     res.jsonp(result);
  //   })
  // });
  Precio.find()
    .then((result) => res.jsonp(result))
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.getById = async function (req, res) {
  const filtroUM =  await Precio.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: 'TipoUnidad',
        localField: 'unidadesMedida._id',
        foreignField: '_id',
        as: 'um',
        pipeline: [
          {
            $project: {
              nombre: 1,
            }
          }
        ]
      }
    },
    {
      $set: {
        unidadesMedida: {
          $map: {
            input: '$unidadesMedida',
            as: 'unidad',
            in: {
              $mergeObjects: [
                '$$unidad',
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$um',
                        as: 'unidadFiltrada',
                        cond: { $eq: ['$$unidad._id', '$$unidadFiltrada._id'] },
                      },
                    }, 0
                  ]
                },
                {
                  "id": "$$unidad._id"
                }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        um: 0
      }
    }
  ]);

  Precio.populate(filtroUM, { path: "establecimiento", select: { _id:1, nombre: 1 }}, (err, filtroEstablecimiento) => {
    Precio.populate(filtroEstablecimiento, { path: "articulo", select: { _id:1, nombre: 1 }}, (err, result) => {
      if (err) {
        res.status(500).send({ message: error });
      }
      res.jsonp(result[0]);
    })
  });
}

module.exports.getByArticuloId = async function (req, res) {
  const filtroUM =  await Precio.aggregate([
    { $match: { articulo: mongoose.Types.ObjectId(req.params.articuloId) } },
    {
      $lookup: {
        from: 'TipoUnidad',
        localField: 'unidadesMedida._id',
        foreignField: '_id',
        as: 'um',
        pipeline: [
          {
            $project: {
              nombre: 1,
            }
          }
        ]
      }
    },
    {
      $set: {
        unidadesMedida: {
          $map: {
            input: '$unidadesMedida',
            as: 'unidad',
            in: {
              $mergeObjects: [
                '$$unidad',
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: '$um',
                        as: 'unidadFiltrada',
                        cond: { $eq: ['$$unidad._id', '$$unidadFiltrada._id'] },
                      },
                    }, 0
                  ]
                },
                {
                  "id": "$$unidad._id"
                }
              ]
            }
          }
        }
      }
    },
    {
      $project: {
        um: 0
      }
    }
  ]);
  Precio.populate(filtroUM, { path: "establecimiento", select: { _id:1, nombre: 1 }}, (err, filtroEstablecimiento) => {
    Precio.populate(filtroEstablecimiento, { path: "articulo", select: { _id:1, nombre: 1 }}, (err, result) => {
      if (err) {
        res.status(500).send({ message: error });
      }
      res.jsonp(result);
    })
  });

  // Precio.find({ articulo: req.params.articuloId })
  //   .then((result) => {
  //     res.jsonp(result)
  //   })
  //   .catch((error) => res.status(500).send({ message: error }))
}

module.exports.getByAny = async function (req, res) {
  const texto = new RegExp(req.params.texto)
  const primerFiltro = await Precio.aggregate([
    {
      $lookup: {
        from: 'Establecimiento',
        localField: 'establecimiento',
        foreignField: '_id',
        as: 'establecimiento_lookup',
        pipeline: [
          { $match: { nombre: { $regex: texto, $options: 'i' } } },
          {
            $project: { raiz: { id: '$_id', nombre: '$nombre', _id: '$_id' } }
          },
          { $replaceRoot: { newRoot: '$raiz' } }
        ],
      },
    },
    {
      $lookup: {
        from: 'Articulo',
        localField: 'articulo',
        foreignField: '_id',
        as: 'articulo_lookup',
        pipeline: [
          { $match: { nombre: { $regex: texto, $options: 'i' } } },
          {
            $project: { raiz: { id: '$_id', nombre: '$nombre', _id: '$_id' } }
          },
          { $replaceRoot: { newRoot: '$raiz' } }
        ]
      }
    },
    {
      $match: {
        $or: [
          { establecimiento_lookup: { $ne: [] } },
          { articulo_lookup: { $ne: [] } }
        ]
      }
    }
  ])
  Precio.populate(
    primerFiltro,
    { path: 'establecimiento', select: { _id: 1, nombre: 1 } },
    (err, result) => {
      Precio.populate(result, {
        path: 'articulo',
        select: { _id: 1, nombre: 1 }
      })
        .then((result) => {
          res.jsonp(result)
        })
        .catch((error) => res.status(500).send({ message: error }))
    }
  )
}

module.exports.insert = function (req, res) {
  const precio = new Precio(req.body)
  if (precio.unidadesMedida.length !== 0) {
    precio.unidadesMedida = precio.unidadesMedida.map((item) => {
      item._id = mongoose.Types.ObjectId(item.id)
      return item
    })
  }
  Precio.findOne({
    articulo: precio.articulo,
    marca: precio.marca,
    establecimiento: precio.establecimiento,
    fechaCompra: precio.fechaCompra,
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          respuesta: 409,
          message: 'Ya existe un registro con esos datos',
        })
      } else {
        precio.save().then((response) => {
          if (response) {
            res.jsonp(response)
          } else {
            res.status(500).send({
              message: 'Error al crear el registro de precio',
            })
          }
        })
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}

module.exports.update = function (req, res) {
  if (req.body.unidadesMedida.length !== 0) {
    req.body.unidadesMedida = req.body.unidadesMedida.map((item) => {
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
        return res.status(500).send({ message: err + ' en Precio' })
      } else {
        res.jsonp(result)
      }
    }
  )
}

module.exports.delete = function (req, res) {
  Precio.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp(result)
      } else {
        res
          .status(500)
          .send({ message: 'Precio con id ' + req.params.id + ' no existe' })
      }
    })
    .catch((error) => res.status(500).send({ message: error }))
}
