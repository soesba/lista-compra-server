'use strict';

var mongoose = require('mongoose');
var Avatar = mongoose.model('Avatar');

module.exports.get = function (req, res) {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    return this.getBy(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Avatar.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No hay avatares creados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getBy = function (req, res) {
  const params = req.query;
  let message = 'nombre ';
  if (params.id) {
    message = 'id ';
    params._id = new mongoose.Types.ObjectId(`${params.id}`);
    delete params.id;
  }
  Avatar.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'Avatar con ' + message + req.params.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByNombre = function (req, res) {
  Avatar.findOne({ nombre: req.params.nombre })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No existe un avatar con ese nombre' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.insert = function (req, res) {
  const avatar = new Avatar(req.body)
  Avatar.findOne({ nombre: avatar.nombre })
    .then((result) => {
      if (result) {
        res.status(409).send({
          respuesta: 409,
          message: 'Ya existe un avatar con ese nombre',
        })
      } else {
        Avatar.save({ new: true }).then(result => {
          res.jsonp({ data: result });
        }).catch((error) => res.status(500).send({ message: error.message }));
      }
    })
    .catch((error) => res.status(500).send({ message: error.message }))
}

module.exports.delete = function (req, res) {
  var userId = req.params.id;

  Avatar.findOneAndRemove({ _id: userId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}