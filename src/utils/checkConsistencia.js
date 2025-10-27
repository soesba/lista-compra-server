const mongoose = require('mongoose');

module.exports.checkDataConsistencyArticulo = async function () {
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

module.exports.checkDataConsistencyEstablecimiento = async function () {
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

module.exports.checkDataConsistencyPrecio = async function () {
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

module.exports.checkDataConsistencyEquivalencias = async function () {
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

module.exports.checkDataConsistencyModelo = async function () {
  const Modelo = mongoose.model('Modelo');
  const Usuario = mongoose.model('Usuario');

  try {
    const usuarios = await Usuario.find().lean();
    const resultados = [];

    for (const usuario of usuarios) {
      const current = {
        id: usuario._id,
        preferencias: usuario.preferencias || [],
        permisos: usuario.permisos || [],
      };

      for (const preferencia of current.preferencias) {
        const existe = await Modelo.exists({ _id: preferencia.modeloId });
        resultados.push({
          usuario: current.id,
          modelo: preferencia.modeloId,
          existe: !!existe,
        });
      };

      for (const permiso of current.permisos) {
        const existe = await Modelo.exists({ _id: permiso.modeloId });
        resultados.push({
          usuario: current.id,
          modelo: permiso.modeloId,
          existe: !!existe,
        });
      };
    };
    console.log('Verificación completa de modelos en preferencias y permisos de usuarios:', resultados.filter(res => res.existe === false));
  } catch (error) {
    console.error('Error al verificar coleccion modelos en usuarios:', error);
  }
}