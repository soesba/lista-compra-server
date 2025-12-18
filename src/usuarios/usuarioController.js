'use strict';

const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');

module.exports.register = function (req, res) {
  const user = new User(req.body);

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
    .populate({ path: 'rol', select: 'nombre' })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.map(item => item.toJSON()) });
      } else {
        res.status(404).send({ message: 'No hay usuarios registrados' });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getById = function (req, res) {
  const params = { _id: new mongoose.Types.ObjectId(`${req.query.id}`) };
  Usuario.findOne(params, { password: 0 })
    .populate({ path: 'rol', select: 'nombre' })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.toJSON() });
      } else {
        res.status(404).send({ message: 'No existe un usuario con id ' + req.query.id });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getByUsername = function (req, res) {
  const params = { username: req.query.username };
  Usuario.findOne(params, { password: 0 })
    .populate({ path: 'rol', select: 'nombre' })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.toJSON() });
      } else {
        res.status(404).send({ message: 'No existe un usuario con username ' + req.query.username });
      }
    })
    .catch(error => res.status(500).send({ message: error.message }));
}

module.exports.getPreferencias = function (req, res) {
  const userId = new mongoose.Types.ObjectId(`${req.params.id}`);
  Usuario.findOne({ _id: userId }, { preferencias: 1 })
    .then(response => {
      if (response) {
        res.jsonp({ data: response.preferencias.map(item => item.toJSON()) });
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
  const userId = new mongoose.Types.ObjectId(`${req.body.id}`);
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

module.exports.delete = async function (req, res) {
  const userId = new mongoose.Types.ObjectId(`${req.params.id}`);

  const Precio = mongoose.model('Precio');
  const Articulo = mongoose.model('Articulo');
  const TipoUnidad = mongoose.model('TipoUnidad');
  const Establecimiento = mongoose.model('Establecimiento');
  const TipoEstablecimiento = mongoose.model('TipoEstablecimiento');

  try {

    // Eliminar precios
    const resultDeletePrecio = (await Precio.deleteMany({ usuario: userId })).deletedCount;

    // Eliminar articulos
    const resultDeleteArticulo = (await Articulo.deleteMany({ usuario: userId })).deletedCount;

    // Eliminar tipos de unidad de medida (si es dato maestro eliminar campo usuario de los precios)
    const resultUpdateTipoUnidad = (await TipoUnidad.updateMany(
      { $or: [{ usuario: userId }, { esDatoMaestro: true }] },
      { $unset: { usuario: "" } }
    )).modifiedCount;
    const resultDeleteTipoUnidad = (await TipoUnidad.deleteMany({ usuario: userId })).deletedCount;

    // Eliminar establecimientos
    const resultEstablecimiento = (await Establecimiento.deleteMany({ usuario: userId })).deletedCount;

    // Eliminar tipos de establecimiento (si es dato maestro eliminar campo usuario de los establecimientos)
    const resultUpdateTipoEstablecimiento = (await TipoEstablecimiento.updateMany(
      { $or: [{ usuario: userId }, { esDatoMaestro: true }] },
      { $unset: { usuario: "" } }
    )).modifiedCount;
    const resultDeleteTipoEstablecimiento = (await TipoEstablecimiento.deleteMany({ usuario: userId })).deletedCount;

    // Eliminar usuario
    Usuario.findOneAndDelete({ _id: userId })
      .then(result => res.jsonp({ data: { result, resultDeletePrecio, resultDeleteArticulo, resultUpdateTipoUnidad, resultDeleteTipoUnidad, resultEstablecimiento, resultUpdateTipoEstablecimiento, resultDeleteTipoEstablecimiento } }))
      .catch(error => {
        return res.status(500).send({ message: error.message })
      });
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
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

module.exports.checkData = async function (req, res) {
  const checkModule = require('../utils/checkConsistencia.js');
  const resultado = await checkModule.checkDataConsistencyUsuario();
  res.jsonp({ data: resultado });
};