'use strict'

var mongoose = require('mongoose')
const Precio = require('./precioModel')

module.exports.get = async function (req, res) {
  Precio.find({ usuario: new mongoose.Types.ObjectId(`${req.user.id}`) })
    .then((result) => res.jsonp({ data: result }))
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.getById = async function (req, res) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  const filtroUM = await Precio.aggregate([
    { $match: { _id: id, usuario: new mongoose.Types.ObjectId(`${req.user.id}`) } },
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
  ]).catch((error) => res.status(500).send({ message: error.message }));

  Precio.populate(filtroUM, { path: "establecimiento", select: { _id: 1, nombre: 1 } }).then(filtroEstablecimiento => {
    Precio.populate(filtroEstablecimiento, { path: "articulo", select: { _id: 1, nombre: 1 } }).then(result => {
      res.jsonp({ data: result[0] });
    }).catch(error => res.status(500).send({ message: error.message }));
  }).catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByArticuloId = async function (req, res) {
  if (!req.params.articuloId) {
    return res.status(400).send({ message: 'El id del articulo es requerido' })
  }
  const id = new mongoose.Types.ObjectId(`${req.params.articuloId}`);
  Precio.aggregate([
    { $match: { articulo: id, usuario: new mongoose.Types.ObjectId(`${req.user.id}`) } },
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
          $sortArray: {
            input: {
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
            },
            sortBy: { nombre: 1 } // Orden ascendente por el campo 'nombre'
          }
        }
      }
    },
    {
      $project: {
        um: 0
      }
    }
  ]).then((filtroUM) => {
    Precio.populate(filtroUM, { path: "establecimiento", select: { _id: 1, nombre: 1 } }).then(filtroEstablecimiento => {
      Precio.populate(filtroEstablecimiento, { path: "articulo", select: { _id: 1, nombre: 1 } }).then(result => {
        res.jsonp({ data: result });
      }).catch((error) => res.status(500).send({ message: error.message }));
    }).catch((error) => res.status(500).send({ message: error.message }));
  }).catch((error) => res.status(500).send({ message: error.message }));

  // Precio.find({ articulo: req.params.articuloId })
  //   .then((result) => {
  //     res.jsonp(result)
  //   })
  //   .catch((error) => res.status(500).send({ message: error.message }))
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
        _id: id, usuario: new mongoose.Types.ObjectId(`${req.user.id}`),
        $or: [
          { establecimiento_lookup: { $ne: [] } },
          { articulo_lookup: { $ne: [] } }
        ]
      }
    }
  ])
  Precio.populate(primerFiltro, { path: 'establecimiento', select: { _id: 1, nombre: 1 } }).then(result => {
    Precio.populate(result, { path: 'articulo', select: { _id: 1, nombre: 1 } }).then((result) => {
      res.jsonp({ data: result })
    }).catch(error => res.status(500).send({ message: error.message }));
  }).catch(error => res.status(500).send({ message: error.message }));
}

module.exports.insert = function (req, res) {
  req.body.usuario = new mongoose.Types.ObjectId(`${req.user.id}`)
  const precio = new Precio(req.body)
  if (precio.unidadesMedida.length !== 0) {
    precio.unidadesMedida = req.body.unidadesMedida.map((item) => {
      item._id = item.id
      return item
    })
  }
  Precio.findOne({
    articulo: precio.articulo,
    marca: precio.marca,
    establecimiento: precio.establecimiento,
    fechaCompra: precio.fechaCompra,
    usuario: new mongoose.Types.ObjectId(`${req.user.id}`)
  })
    .then((u) => {
      if (u) {
        res.status(409).send({
          message: 'Ya existe un registro con esos datos',
        })
      } else {
        precio.save().then((response) => {
          if (response) {
            res.jsonp({ data: response })
          } else {
            res.status(500).send({
              message: 'Error al crear el registro de precio',
            })
          }
        })
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.update = function (req, res) {
  if (req.body.unidadesMedida.length !== 0) {
    req.body.unidadesMedida = req.body.unidadesMedida.map((item) => {
      item._id = new mongoose.Types.ObjectId(`${item.id}`)
      return item
    })
  }
  Precio.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(`${req.body.id}`) },
    { $set: req.body },
    { new: true, returnOriginal: false }).then(result => {
      if (result) {
        res.jsonp({ data: result })
      } else {
        res.status(500).send({ message: 'Error al actualizar el registro de precio' })
      }
    }).catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.delete = function (req, res) {
  Precio.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result) {
        res.jsonp({ data: result })
      } else {
        res
          .status(500)
          .send({ message: 'Precio con id ' + req.params.id + ' no existe' })
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.checkData = async function (req, res) {
  const checkModule = require('../utils/checkConsistencia.js');
  const resultado = await checkModule.checkDataConsistencyPrecio();
  res.jsonp({ data: resultado });
}