"use strict";
var mongoose = require("mongoose");

module.exports.asignarUsuario = function (req, res) {
  let coleccion = ''
  const modelo = req.body.modelo;
  const usuarioId = req.body.usuarioId;
  const ids = req.body.ids;

  switch (modelo) {
    case 'Articulo':
      coleccion = require('../articulos/articuloModel');
      break;
    case 'TipoEstablecimiento':
      coleccion = require('../tipoEstablecimientos/tipoEstablecimientoModel');
      break;
    case 'Establecimiento':
      coleccion = require('../establecimientos/establecimientoModel');
      break;
    case 'Precio':
      coleccion = require('../precios/precioModel');
      break;
    case 'TipoUnidad':
      coleccion = require('../tipoUnidades/tipoUnidadModel');
      break;
    case 'TipoUnidadEquivalencia':
      coleccion = require('../tipoUnidadEquivalencia/tipoUnidadEquivalenciaModel');
      break;
    default:
      return res.status(400).send({ message: 'Modelo no soportado para asignar usuario' });
  }

  coleccion.updateMany(
    { _id: { $in: ids.map(id => new mongoose.Types.ObjectId(`${id}`)) } },
    { $set: { usuario: new mongoose.Types.ObjectId(`${usuarioId}`) } }
  ).then(result => {
    return res.jsonp({ data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    } });
  }).catch(error => {
    return  res.status(500).send({ message: error.message });
  });
}

module.exports.asignarRol = function (req, res) {
  let coleccion = ''
  const modelo = req.body.modelo;
  const rolId = req.body.rolId;
  const ids = req.body.ids;

  switch (modelo) {
    case 'Usuario':
      coleccion = require('../usuarios/usuarioModel');
      break;
    default:
      return res.status(400).send({ message: 'Modelo no soportado para asignar rol' });
  }

  coleccion.updateMany(
    { _id: { $in: ids.map(id => new mongoose.Types.ObjectId(`${id}`)) } },
    { $set: { rol: new mongoose.Types.ObjectId(`${rolId}`) } }
  ).then(result => {
    return res.jsonp({ data: {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    } });
  }).catch(error => {
    return  res.status(500).send({ message: error.message });
  });
}