'use strict';

const ArticuloData = require('./src/data/articulos.json');
const TipoUnidadesData = require('./src/data/tipoUnidades.json');
const TipoEstablecimientosData = require('./src/data/tipoEstablecimientos.json');
const EstablecimientosData = require('./src/data/establecimientos.json')
const mongoose = require('mongoose');
const { checkDataConsistencyArticulo, checkDataConsistencyEstablecimiento, checkDataConsistencyPrecio, checkDataConsistencyEquivalencias, checkDataConsistencyModelo, checkDataConsistencyTipoUnidad } = require('./src/utils/checkConsistencia');



module.exports.initCollection = async function(nombreColeccion) {
  crearColeccion (nombreColeccion);
}

function crearColeccion (nombreColeccion) {
  switch (nombreColeccion) {
    case 'Articulo':
      crearColeccionArticulo();
      break;
    case 'TipoUnidad':
      crearColeccionTipoUnidad();
      break;
    case 'TipoEstablecimiento':
      crearColeccionTipoEstablecimiento();
      break;
    case 'Establecimiento':
      crearColeccionEstablecimiento();
      break;
  }
}

function crearColeccionArticulo () {
  ArticuloData.forEach(async function (item) {
    const Articulo = mongoose.model('Articulo')
    const nuevoArticulo = new Articulo(item);
    nuevoArticulo._id = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoArticulo.save();
  })
}

function crearColeccionTipoUnidad () {
  TipoUnidadesData.forEach(async function (item) {
    const TipoUnidad = mongoose.model('TipoUnidad')
    const nuevoTipoUnidad = new TipoUnidad(item);
    nuevoTipoUnidad._id = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoTipoUnidad.save();
  })
}

function crearColeccionTipoEstablecimiento () {
  TipoEstablecimientosData.forEach(async function (item) {
    const TipoEstablecimiento = mongoose.model('TipoEstablecimiento')
    const nuevoTipoEstablecimiento = new TipoEstablecimiento(item);
    nuevoTipoEstablecimiento._id = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoTipoEstablecimiento.save();
  })
}

function crearColeccionEstablecimiento () {
  EstablecimientosData.forEach(async function (item) {
    const Establecimiento = mongoose.model('Establecimiento')
    const nuevoEstablecimiento = new Establecimiento(item);
    nuevoEstablecimiento._id = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoEstablecimiento.save();
  })
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
    case 'Modelo':
      checkDataConsistencyModelo();
      break;
    case 'TipoUnidad':
      checkDataConsistencyTipoUnidad();
      break;
  }
}

