'use strict';

var mongoose = require('mongoose');
var Avatar = mongoose.model('Avatar');

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

module.exports.getById = function (req, res) {
  const id = new mongoose.Types.ObjectId(`${req.params.id}`);
  Avatar.findOne({ _id: id })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'Avatar con id ' + id + ' no existe' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.insert = function (req, res) {
  const avatar = new Avatar(req.body)
  avatar.save({ new: true }).then(result => {
    res.jsonp({ data: result });
  }).catch((error) => res.status(500).send({ message: error.message }));
}

module.exports.delete = function (req, res) {
  var userId = req.params.id;

  Avatar.findOneAndDelete({ _id: userId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}