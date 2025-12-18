'use strict';

const mongoose = require('mongoose');
const initCollections = require('./initCollections');
const { repairCollections } = require('./repairCollections');
const conexion =  mongoose.connection.db;
const listaTablasMaestras = ['TipoEstablecimiento', 'TipoUnidad'];

module.exports.init = async function() {
  checkTablasMaestras();
  await repairCollections();
}

async function checkTablasMaestras () {
  for (const item of listaTablasMaestras) {
    const colecciones = await conexion.listCollections({ name: item }).toArray();
    if (colecciones.length > 0) {
      console.log(`La colección '${item}' existe.`);
      const numeroRegistros = await (mongoose.model(item)).countDocuments();
      if (numeroRegistros === 0) {
        console.log(`La colección '${item}' no tiene registros.`);
        initCollections.initCollection(item);
      } else {
        initCollections.checkDataConsistency(item)
      }
    } else {
      console.log(`La colección '${item}' no existe.`);
      initCollections.initCollection(item);
    }
  }
  // initCollections.checkDataConsistency('Precio');
}