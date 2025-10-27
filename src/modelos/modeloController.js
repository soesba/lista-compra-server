'use strict';

var mongoose = require('mongoose');
var Modelo = mongoose.model('Modelo');

module.exports.get = function (req, res) {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    const params = req.query;
    if (params.id) return this.getById(req, res);
    if (params.nombre) return this.getByNombre(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Modelo.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'No hay modelos creados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  const params = { _id: new mongoose.Types.ObjectId(`${req.query.id}`) };
  Modelo.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Modelo con id ' + req.query.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByNombre = function (req, res) {
  const params = { nombre: req.query.nombre };
  Modelo.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Modelo con nombre ' + req.query.nombre + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.update = function (req, res) {
  var modeloId = req.params.id;
  var data = req.body;

  Modelo.updateOne({ _id: modeloId }, data)
    .then(response => res.jsonp({ data: response }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.delete = function (req, res) {
  var modeloId = req.params.id;

  Modelo.findOneAndDelete({ _id: modeloId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.checkUso = function (req, res) {
  const modeloId = req.params.id;
  const checkUsoModelo = require('../utils/checkUso').checkUsoModelo;

  checkUsoModelo(modeloId)
    .then(resultados => {
      res.jsonp({ data: resultados });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};
