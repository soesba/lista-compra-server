'use strict';

var mongoose = require('mongoose');
var Modelo = mongoose.model('Modelo');

module.exports.getById = function (req, res) {
  Modelo.findOne({ '_id': req.params.id })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Modelo con id ' + req.params.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.get = function (req, res) {
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