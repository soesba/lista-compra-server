const mongoose = require('mongoose');

module.exports.checkDataConsistencyArticulo = async function () {
  const Articulo = mongoose.model('Articulo');
  const TipoUnidad = mongoose.model('TipoUnidad');

  try {
    const articulos = await Articulo.find().lean();
    const resultados = [];

    for (const articulo of articulos) {
      const current = {
        id: articulo._id,
        nombre: articulo.nombre,
        tiposUnidad: articulo.tiposUnidad || [],
        usuario: articulo.usuario
      };

      // Comprobacion de existencia del usuario asociado al articulo
      if (!current.usuario) {
        resultados.push({
          modelo: 'Usuario',
          articulo: `${current.id} - ${current.nombre}`,
          usuario: null,
          existe: false,
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            modelo: 'Usuario',
            articulo: `${current.id} - ${current.nombre}`,
            id: current.usuario,
            existe: !!existeUsuario,
          });
        }
      }

      // Comprobacion de existencia de cada tipo de unidad asociado al articulo
      for (const idUnidad of current.tiposUnidad) {
        const existe = await TipoUnidad.exists({ _id: idUnidad });
        if (!existe) {
          resultados.push({
            modelo: 'TipoUnidad',
            articulo: `${current.id} - ${current.nombre}`,
            id: idUnidad,
            existe: !!existe,
          });
        }
      }
    }

    const respuesta = {
      totalArticulos: articulos.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de tipos de unidad en articulos: ${respuesta.totalFallas} errores`);
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
        usuario: establecimiento.usuario
      };

      // Comprobacion de existencia del usuario asociado al establecimiento
      if (!current.usuario) {
        resultados.push({
          modelo: 'Usuario',
          establecimiento: `${current.id} - ${current.nombre}`,
          usuario: null,
          existe: false,
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            modelo: 'Usuario',
            establecimiento: `${current.id} - ${current.nombre}`,
            id: current.usuario,
            existe: !!existeUsuario,
          });
        }
      }

      // Comprobacion de existencia del tipo de establecimiento asociado
      const existe = await TipoEstablecimiento.exists({ _id: current.tipo });
      if (!existe) {
        resultados.push({
          modelo: 'TipoEstablecimiento',
          establecimiento: `${current.id} - ${current.nombre}`,
          id: current.tipo,
          existe: !!existe,
        });
      }
    }

    const respuesta = {
      totalEstablecimientos: establecimientos.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de tipos de establecimiento en establecimientos: ${respuesta.totalFallas} errores`);
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
        precio: precio.precio,
        unidades: precio.unidadesMedida || [],
        usuario: precio.usuario
      };

       // Comprobacion de existencia del usuario asociado al precio
      if (!current.usuario) {
        resultados.push({
          modelo: 'Usuario',
          precio: `${current.id} - ${current.precio}`,
          usuario: null,
          existe: false,
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            modelo: 'Usuario',
            precio: `${current.id} - ${current.precio}`,
            id: current.usuario,
            existe: !!existeUsuario,
          });
        }
      }

      // Comprobacion de existencia de cada tipo de unidad asociado al precio
      for (const unidad of current.unidades) {
        const existe = await TipoUnidad.exists({ _id: unidad._id });
        if (!existe) {
          resultados.push({
            modelo: 'TipoUnidad',
            precio: `${current.id} - ${current.precio}`,
            id: unidad._id,
            existe: !!existe,
          });
        }
      }
    }

     const respuesta = {
      totalArticulos: precios.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de tipos de unidad en precios: ${respuesta.totalFallas} errores`);
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

      if (!existeFrom || !existeTo) {
        resultados.push({
          modelo: 'TipoUnidadEquivalencia',
          equivalenciaId: current.id,
          from: current.from,
          existeFrom: !!existeFrom,
          existeTo: !!existeTo,
        });
      }
    }

    const respuesta = {
      totalArticulos: equivalencias.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de tipos de unidad en equivalencias: ${respuesta.totalFallas} errores`);
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