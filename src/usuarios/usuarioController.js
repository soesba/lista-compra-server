'use strict';

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

module.exports.authenticate = function (req, res) {
  Usuario.findOne({ username: req.body.username, password: req.body.password })
    .then(result => {
      if (result) {
        res.jsonp({ data: result });
      } else {
        res.status(500).send({ message: 'Username or password is incorrect' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.register = function (req, res) {
  var user = new User(req.body);

  Usuario.findOne({ username: user.username })
    .then(result => {
      if (result) {
        res.status(500).send({ message: 'Username "' + user.username + '" is already taken' });
      }
    });

  user.save()
    .then(result => res.jsonp({ data: result }))
    .catch(error => res.status(500).send({ message: error.message }));

}

module.exports.getAll = function (req, res) {
  Usuario.find()
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'No hay usuarios registrados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  Usuario.findOne({ '_id': req.params.id })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(500).send({ message: 'User with id ' + req.params.id + ' no exists' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));;
}

module.exports.update = function (req, res) {
  var userId = req.params.id;
  var data = req.body;

  Usuario.updateOne({ _id: userId }, data)
    .then(response => res.jsonp({ data: response }))
    .catch(error => {
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