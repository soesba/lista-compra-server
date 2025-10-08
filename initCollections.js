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
    nuevoArticulo.tipoUnidad = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoArticulo.save();
  })
}

function crearColeccionTipoUnidad () {
  TipoUnidadesData.forEach(async function (item) {
    const TipoUnidad = mongoose.model('TipoUnidad')
    const nuevoTipoUnidad = new TipoUnidad(item);
    nuevoTipoUnidad.tipoUnidad = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoTipoUnidad.save();
  })
}

function crearColeccionTipoEstablecimiento () {
  TipoEstablecimientosData.forEach(async function (item) {
    const TipoEstablecimiento = mongoose.model('TipoEstablecimiento')
    const nuevoTipoEstablecimiento = new TipoEstablecimiento(item);
    nuevoTipoEstablecimiento.tipoUnidad = new mongoose.Types.ObjectId(`${item._id}`)
    const resultado = await nuevoTipoEstablecimiento.save();
  })
}

function crearColeccionEstablecimiento () {
  EstablecimientosData.forEach(async function (item) {
    const Establecimiento = mongoose.model('Establecimiento')
    const nuevoEstablecimiento = new Establecimiento(item);
    nuevoEstablecimiento.tipoUnidad = new mongoose.Types.ObjectId(`${item._id}`)
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
  }
}

async function checkDataConsistencyArticulo () {
  const Articulo = mongoose.model('Articulo');
  const TipoUnidad = mongoose.model('TipoUnidad');

  try {
    const articulos = await Articulo.find().lean();
    const resultados = [];

    for (const articulo of articulos) {
      const currentArt = {
        id: articulo._id,
        nombre: articulo.nombre,
        tiposUnidad: articulo.tiposUnidad || [],
      };

      for (const idUnidad of currentArt.tiposUnidad) {
        const existe = await TipoUnidad.exists({ _id: idUnidad });
        resultados.push({
          id: idUnidad,
          existe: !!existe,
        });
      }
    }

    console.log('Verificación completa de tipos de unidad en articulos:', resultados.filter(res => res.existe === false));
  } catch (error) {
    console.error('Error al verificar coleccion articulos:', error);
  }
}

async function checkDataConsistencyEstablecimiento () {
  const Establecimiento = mongoose.model('Establecimiento');
  const TipoEstablecimiento = mongoose.model('TipoEstablecimiento');

  try {
    const establecimientos = await Establecimiento.find().lean();
    const resultados = [];

    for (const establecimiento of establecimientos) {
      const current = {
        id: establecimiento._id,
        nombre: establecimiento.nombre,
        tipo: establecimiento.tipoEstablecimiento,
      };

      const existe = await TipoEstablecimiento.exists({ _id: current.tipo });
      resultados.push({
        establecimiento: current.nombre,
        id: current.tipo,
        existe: !!existe,
      });
    }

    console.log('Verificación completa de tipos de establecimiento en establecimientos:', resultados.filter(res => res.existe === false));
  } catch (error) {
    console.error('Error al verificar coleccion establecimientos:', error);
  }
}

async function checkDataConsistencyPrecio () {
  const Precio = mongoose.model('Precio');
  const TipoUnidad = mongoose.model('TipoUnidad');

  try {
    const precios = await Precio.find().lean();
    const resultados = [];

    for (const precio of precios) {
      const current = {
        id: precio._id,
        articulo: precio.articulo,
        unidades: precio.unidadesMedida || [],
      };

      for (const unidad of current.unidades) {
        const existe = await TipoUnidad.exists({ _id: unidad._id });
        resultados.push({
          articulo: current.articulo,
          id: unidad._id,
          existe: !!existe,
        });
      }
    }

    console.log('Verificación completa de tipos de unidad en precios:', resultados.filter(res => res.existe === false));
  } catch (error) {
    console.error('Error al verificar coleccion precios:', error);
  }
}

async function checkDataConsistencyEquivalencias () {
  const TipoUnidadEquivalencia = mongoose.model('TipoUnidadEquivalencia');
  const TipoUnidad = mongoose.model('TipoUnidad');

  try {
    const equivalencias = await TipoUnidadEquivalencia.find().lean();
    const resultados = [];

    for (const eq of equivalencias) {
      const current = {
        id: eq._id,
        from: eq.from,
        to: eq.to,
      };

      const existeFrom = await TipoUnidad.exists({ _id: current.from });
      const existeTo = await TipoUnidad.exists({ _id: current.to });
      resultados.push({
        equivalenciaId: current.id,
        from: current.from,
        existeFrom: !!existeFrom,
        existeTo: !!existeTo,
      });
    }

    console.log('Verificación completa de tipos de unidad en equivalencias:', resultados.filter(res => res.existeFrom === false || res.existeTo === false));
  } catch (error) {
    console.error('Error al verificar coleccion equivalencias:', error);
  }
}