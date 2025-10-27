'use strict';

var mongoose = require('mongoose');
var Configuracion = mongoose.model('Configuracion');

module.exports.get = function (req, res) {
  const query = req.query;
 if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    const params = req.query;
    if (params.id) return this.getById(req, res);
    if (params.categoria) return this.getByCategoria(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Configuracion.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'No hay configuraciones creadas' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  const params = req.query;
  Configuracion.findOne({ '_id': params.id })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Configuracion con id ' + params.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByCategoria = function (req, res) {
  const params = req.query;
  Configuracion.find({ 'categoria': params.categoria })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Configuracion con categoria ' + params.categoria + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.update = function (req, res) {
  var modeloId = req.params.id;
  var data = req.body;

  Configuracion.updateOne({ _id: modeloId }, data)
    .then(response => res.jsonp({ data: response }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.delete = function (req, res) {
  var modeloId = req.params.id;

  Configuracion.findOneAndDelete({ _id: modeloId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}