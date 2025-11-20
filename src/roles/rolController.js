'use strict';

var mongoose = require('mongoose');
var Rol = mongoose.model('Rol');

module.exports.get = function (req, res) {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    const params = req.query;
    if (params.id) return this.getById(req, res);
    if (params.codigo) return this.getByCodigo(req, res);
    if (params.nombre) return this.getByNombre(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Rol.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'No hay roles creados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  const params = { _id: new mongoose.Types.ObjectId(`${req.query.id}`) };
  Rol.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Rol con id ' + req.query.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByCodigo = function (req, res) {
  const params = { codigo: req.query.codigo };
  Rol.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Rol con codigo ' + req.query.codigo + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByNombre = function (req, res) {
  const params = { nombre: req.query.nombre };
  Rol.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'Rol con nombre ' + req.query.nombre + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.update = function (req, res) {
  var modeloId = req.params.id;
  var data = req.body;

  Rol.updateOne({ _id: modeloId }, data)
    .then(response => res.jsonp({ data: response }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.delete = function (req, res) {
  var modeloId = req.params.id;

  Rol.findOneAndDelete({ _id: modeloId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.checkUso = function (req, res) {
  const rolId = req.params.id;
  const checkUsoRol = require('../utils/checkUso').checkUsoRol;

  checkUsoRol(rolId)
    .then(resultados => {
      res.jsonp({ data: resultados });
    })
    .catch(error => {
      res.status(500).send({ message: error.message });
    });
};
