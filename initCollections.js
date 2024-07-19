'use strict';

const ArticuloData = require('./src/data/articulos.json');
const TipoUnidadesData = require('./src/data/tipoUnidades.json');
const TipoEstablecimientosData = require('./src/data/tipoEstablecimientos.json');
const EstablecimientosData = require('./src/data/establecimientos.json')
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
    console.log('LOG~ ~ nuevoArticulo:', nuevoArticulo)
    const resultado = await nuevoArticulo.save();
    console.log('Documento insertado:', resultado);
  })
}

function crearColeccionTipoUnidad () {
  TipoUnidadesData.forEach(async function (item) {
    const TipoUnidad = mongoose.model('TipoUnidad')
    const nuevoTipoUnidad = new TipoUnidad(item);
    nuevoTipoUnidad.tipoUnidad = mongoose.Types.ObjectId(item._id)
    console.log('LOG~ ~ nuevoTipoUnidad:', nuevoTipoUnidad)
    const resultado = await nuevoTipoUnidad.save();
    console.log('Documento insertado:', resultado);
  })
}

function crearColeccionTipoEstablecimiento () {
  TipoEstablecimientosData.forEach(async function (item) {
    const TipoEstablecimiento = mongoose.model('TipoEstablecimiento')
    const nuevoTipoEstablecimiento = new TipoEstablecimiento(item);
    nuevoTipoEstablecimiento.tipoUnidad = mongoose.Types.ObjectId(item._id)
    console.log('LOG~ ~ nuevoTipoEstablecimiento:', nuevoTipoEstablecimiento)
    const resultado = await nuevoTipoEstablecimiento.save();
    console.log('Documento insertado:', resultado);
  })
}

function crearColeccionEstablecimiento () {
  EstablecimientosData.forEach(async function (item) {
    const Establecimiento = mongoose.model('Establecimiento')
    const nuevoEstablecimiento = new Establecimiento(item);
    nuevoEstablecimiento.tipoUnidad = mongoose.Types.ObjectId(item._id)
    console.log('LOG~ ~ nuevoEstablecimiento:', nuevoEstablecimiento)
    const resultado = await nuevoEstablecimiento.save();
    console.log('Documento insertado:', resultado);
  })
}