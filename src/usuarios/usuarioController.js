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
    const params = req.query;
    if (params.id) return this.getById(req, res);
    if (params.username) return this.getByUsername(req, res);
  }
}

module.exports.getAll = function (req, res) {
  Usuario.find({}, { password: 0 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No hay usuarios registrados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  const params = { _id: new mongoose.Types.ObjectId(`${req.query.id}`) };
  Usuario.findOne(params, { password: 0 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No existe un usuario con id ' + req.query.id });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByUsername = function (req, res) {
  const params = { username: req.query.username };
  Usuario.findOne(params, { password: 0 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response });
      } else {
        res.status(404).send({ message: 'No existe un usuario con username ' + req.query.username });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getPreferencias = function (req, res) {
  var userId = new mongoose.Types.ObjectId(`${req.params.id}`);
  Usuario.findOne({ _id: userId }, { preferencias: 1 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.preferencias });
      } else {
        res.status(404).send({ message: 'No existe un usuario con ese ID' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getFoto = function (req, res) {
  const query = req.query;
  if (Object.keys(query).length === 0) {
    return this.getAll(req, res);
  } else {
    const params = req.query;
    if (params.id) return this.getFotoById(req, res);
    if (params.username) return this.getFotoByUsername(req, res);
  }
}
module.exports.getFotoById = function (req, res) {
  const params = { _id: new mongoose.Types.ObjectId(`${req.query.id}`) };
  Usuario.findOne(params, { foto: 1 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.foto });
      } else {
        res.status(404).send({ message: 'No existe un usuario con ese ID' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getFotoByUsername = function (req, res) {
  const params = { username: req.query.username };
  Usuario.findOne(params, { foto: 1 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.foto });
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

  Usuario.findOneAndDelete({ _id: userId })
    .then(result => res.jsonp({ data: result }))
    .catch(error => {
      return res.status(500).send({ message: error.message })
    });

}

module.exports.getDesplegable = function (req, res) {
  Usuario.aggregate([
    {
      "$project": {
        _id: 0,
        "id": "$_id",
        "nombre": "$username"
      }
    }
  ]).then((result) => {
    if (result) {
      res.jsonp({ data: result })
    }
  }).catch((error) => res.status(500).send({ message: error.message }));
};