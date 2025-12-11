'use strict';

const mongoose = require('mongoose');
const Rol = mongoose.model('Rol');

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
        res.jsonp({ data: response.map(item => item.toJSON()) });
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
        res.jsonp({ data: response.toJSON() });
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
        res.jsonp({ data: response.toJSON() });
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
        res.jsonp({ data: response.toJSON() });
      } else {
        res.status(500).send({ message: 'Rol con nombre ' + req.query.nombre + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.update = function (req, res) {
  const modeloId = req.params.id;
  const data = req.body;

  Rol.updateOne({ _id: modeloId }, data)
    .then(response => res.jsonp({ data: response }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.delete = function (req, res) {
  const rolId = req.params.id;
  const enUso = checkUsoRol(rolId)

  if (enUso.length > 0) {
    res.status(409).send({respuesta: 409, message: 'ElIl rol está en uso', data: enUso });
  } else {
    Rol.findOneAndDelete({ _id: rolId })
      .then(result => res.jsonp({ data: result }))
      .catch(error => {
        return res.status(500).send({ message: error.message })
      });
    }
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


module.exports.getDesplegable = function (req, res) {
  console.log('getDesplegable roles');
  Rol.aggregate([
    {
      "$project":{
        _id: 0,
        "id": "$_id",
        "nombre": "$nombre"
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result });
    }
  }).catch((error) => res.status(500).send({ message: error.message }))
}