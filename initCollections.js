'use strict';

const ArticuloData = require('./src/data/articulos.json');
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
  }
}

function crearColeccionArticulo () {
  console.log(ArticuloData);
  ArticuloData.forEach(async function (item) {
    const Articulo = mongoose.model('Articulo')
    const nuevoArticulo = new Articulo(item);
    nuevoArticulo.tipoUnidad = mongoose.Types.ObjectId(item.tipoUnidad)
    console.log('LOG~ ~ nuevoArticulo:', nuevoArticulo)
    const resultado = await nuevoArticulo.save();
    console.log('Documento insertado:', resultado);
  })
}

function crearColeccionTipoUnidad () {

}