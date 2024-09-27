'use strict';

const ArticuloData = require('./src/data/ListaCompra.Articulo.json');
const TipoUnidadesData = require('./src/data/ListaCompra.TipoUnidad.json');
const TipoEstablecimientosData = require('./src/data/ListaCompra.TipoEstablecimiento.json');
const EstablecimientosData = require('./src/data/ListaCompra.Establecimiento.json')
const mongoose = require('mongoose');
const conexion =  mongoose.connection.db;


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
    nuevoArticulo.tipoUnidad = mongoose.Types.ObjectId(item._id)
    const resultado = await nuevoArticulo.save();
  })
}

function crearColeccionTipoUnidad () {
  TipoUnidadesData.forEach(async function (item) {
    const TipoUnidad = mongoose.model('TipoUnidad')
    const nuevoTipoUnidad = new TipoUnidad(item);
    nuevoTipoUnidad.tipoUnidad = mongoose.Types.ObjectId(item._id)
    const resultado = await nuevoTipoUnidad.save();
  })
}

function crearColeccionTipoEstablecimiento () {
  TipoEstablecimientosData.forEach(async function (item) {
    const TipoEstablecimiento = mongoose.model('TipoEstablecimiento')
    const nuevoTipoEstablecimiento = new TipoEstablecimiento(item);
    nuevoTipoEstablecimiento.tipoUnidad = mongoose.Types.ObjectId(item._id)
    const resultado = await nuevoTipoEstablecimiento.save();
  })
}

function crearColeccionEstablecimiento () {
  EstablecimientosData.forEach(async function (item) {
    const Establecimiento = mongoose.model('Establecimiento')
    const nuevoEstablecimiento = new Establecimiento(item);
    nuevoEstablecimiento.tipoUnidad = mongoose.Types.ObjectId(item._id)
    const resultado = await nuevoEstablecimiento.save();
  })
}