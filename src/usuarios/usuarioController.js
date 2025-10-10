'use strict';

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

module.exports.register = function (req, res) {
  var user = new User(req.body);

  Usuario.findOne({ username: user.username })
    .then(result => {
      if (result) {
        res.status(409).send({ message: 'El nombre de usuario "' + user.username + '" ya está en uso' });
      }
    });

  user.save()
    .then(result => res.jsonp({ data: result }))
    .catch(error => res.status(500).send({ message: error.message }));

}

module.exports.get = function (req, res) {
  const query = req.query;
 if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    return this.getBy(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Usuario.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No hay usuarios registrados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getBy = function (req, res) {
  const params = req.query;
  let message = 'username ';
  if (params.id) {
    message = 'id ';
    params._id = new mongoose.Types.ObjectId(`${params.id}`);
    delete params.id;
  }
  Usuario.findOne(params)
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'Usuario con ' + message + req.params.id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByUsername = function (req, res) {
  Usuario.findOne({ username: req.params.username })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No existe un usuario con ese username' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.update = function (req, res) {
  var userId = new mongoose.Types.ObjectId(`${req.body.id}`);
  const newUsuario = {
    ...req.body
  }
  delete newUsuario.id;

  Usuario.findOneAndUpdate({ _id: userId }, newUsuario, { new: true }).then(response => {
    return res.jsonp({ data: response })
  }).catch(error => {
    return res.status(500).send({ message: error.message })
  });
}

module.exports.delete = function (req, res) {
  var userId = req.params.id;

  Usuario.findOneAndRemove({ _id: userId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}