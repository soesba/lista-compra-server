'use strict';

const ArticuloData = require('./src/data/articulos.json');
const TipoUnidadesData = require('./src/data/tipoUnidades.json');
const TipoEstablecimientosData = require('./src/data/tipoEstablecimientos.json');
const EstablecimientosData = require('./src/data/establecimientos.json')
const mongoose = require('mongoose');
const {
  checkDataConsistencyArticulo,
  checkDataConsistencyEstablecimiento,
  checkDataConsistencyPrecio,
  checkDataConsistencyEquivalencias,
  checkDataConsistencyUsuario,
  checkDataConsistencyTipoUnidad,
  checkDataConsistencyTipoEstablecimiento } = require('./src/utils/checkConsistencia');

module.exports.initCollection = async function(nombreColeccion) {
  await crearColeccion (nombreColeccion);
}

async function crearColeccion (nombreColeccion) {
  switch (nombreColeccion) {
    case 'Articulo':
      await crearColeccionArticulo();
      break;
    case 'TipoUnidad':
      await crearColeccionTipoUnidad();
      break;
    case 'TipoEstablecimiento':
      await crearColeccionTipoEstablecimiento();
      break;
    case 'Establecimiento':
      await crearColeccionEstablecimiento();
      break;
  }
}

async function crearColeccionArticulo () {
  for (const item of ArticuloData) {
    const Articulo = mongoose.model('Articulo')
    const nuevoArticulo = new Articulo(item);
    nuevoArticulo._id = new mongoose.Types.ObjectId(`${item._id}`)
    await nuevoArticulo.save();
  }
}

async function crearColeccionTipoUnidad () {
  for (const item of TipoUnidadesData) {
    const TipoUnidad = mongoose.model('TipoUnidad')
    const nuevoTipoUnidad = new TipoUnidad(item);
    nuevoTipoUnidad._id = new mongoose.Types.ObjectId(`${item._id}`)
    await nuevoTipoUnidad.save();
  }
}

async function crearColeccionTipoEstablecimiento () {
  for (const item of TipoEstablecimientosData) {
    const TipoEstablecimiento = mongoose.model('TipoEstablecimiento')
    const nuevoTipoEstablecimiento = new TipoEstablecimiento(item);
    nuevoTipoEstablecimiento._id = new mongoose.Types.ObjectId(`${item._id}`)
    await nuevoTipoEstablecimiento.save();
  }
}

async function crearColeccionEstablecimiento () {
  for (const item of EstablecimientosData) {
    const Establecimiento = mongoose.model('Establecimiento')
    const nuevoEstablecimiento = new Establecimiento(item);
    nuevoEstablecimiento._id = new mongoose.Types.ObjectId(`${item._id}`)
    await nuevoEstablecimiento.save();
  }
}

module.exports.checkDataConsistency = function (nombreColeccion) {
  switch (nombreColeccion) {
    case 'Articulo':
      checkDataConsistencyArticulo();
      break;
    case 'Establecimiento':
      checkDataConsistencyEstablecimiento();
      break;
    case 'Precio':
      checkDataConsistencyPrecio();
      break;
    case 'Equivalencias':
      checkDataConsistencyEquivalencias();
      break;
    case 'Usuario':
      checkDataConsistencyUsuario();
      break;
    case 'TipoUnidad':
      checkDataConsistencyTipoUnidad();
      break;
    case 'TipoEstablecimiento':
      checkDataConsistencyTipoEstablecimiento();
      break;
  }
}

