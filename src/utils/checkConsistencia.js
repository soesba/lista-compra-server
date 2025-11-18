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
          id: current.id,
          nombre: current.nombre,
          mensaje: `no tiene usuario asociado`
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            id: current.id,
            nombre: current.nombre,
            mensaje: `tiene un usuario asociado que no existe: ${current.usuario}`
          });
        }
      }

      // Comprobacion de existencia de cada tipo de unidad asociado al articulo
      for (const idUnidad of current.tiposUnidad) {
        const existe = await TipoUnidad.exists({ _id: idUnidad });
        if (!existe) {
          resultados.push({
            id: current.id,
            nombre: current.nombre,
            mensaje: `tiene un tipo de unidad asociado que no existe: ${idUnidad}`
          });
        }
      }
    }

    const respuesta = {
      total: articulos.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de datos en articulos: ${respuesta.totalFallas} errores`);
    return respuesta;
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
          id: current.id,
          nombre: current.nombre,
          mensaje: `no tiene usuario asociado`
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            id: current.id,
            nombre: current.nombre,
            mensaje: `tiene un usuario asociado que no existe: ${current.usuario}`
          });
        }
      }

      // Comprobacion de existencia del tipo de establecimiento asociado
      const existe = await TipoEstablecimiento.exists({ _id: current.tipo });
      if (!existe) {
        resultados.push({
          id: current.id,
          nombre: current.nombre,
          mensaje: `tiene un tipo de establecimiento asociado que no existe: ${current.tipo}`
        });
      }
    }

    const respuesta = {
      total: establecimientos.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de datos en establecimiento: ${respuesta.totalFallas} errores`);
    return respuesta;
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
          id: current.id,
          precio: current.precio,
          mensaje: `no tiene usuario asociado`
        });
      } else {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            id: current.id,
            precio: current.precio,
            mensaje: `tiene un usuario asociado que no existe: ${current.usuario}`
          });
        }
      }

      // Comprobacion de existencia de cada tipo de unidad asociado al precio
      for (const unidad of current.unidades) {
        const existe = await TipoUnidad.exists({ _id: unidad._id });
        if (!existe) {
          resultados.push({
            id: current.id,
            precio: current.precio,
            mensaje: `tiene un tipo de unidad asociado que no existe: ${unidad._id}`
          });
        }
      }
    }

     const respuesta = {
      total: precios.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de datos en precios: ${respuesta.totalFallas} errores`);
    return respuesta;
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
        const error = !existeFrom ? `from: ${current.from}` : `to: ${current.to}`;
        resultados.push({
          id: current.id,
          nombre: error,
          error: 'tiene referencias inválidas'
        });
      }
    }

    const respuesta = {
      total: equivalencias.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de datos en equivalencias: ${respuesta.totalFallas} errores`);
    return respuesta;
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
        if (!existe) {
          resultados.push(`El usuario ${current.id} tiene una configuración de un modelo que no existe: ${preferencia.modeloId}`);
        }
      };

      for (const permiso of current.permisos) {
        const existe = await Modelo.exists({ _id: permiso.modeloId });
        if (!existe) {
          resultados.push(`El usuario ${current.id} tiene un permiso para un modelo que no existe: ${permiso.modeloId}`);
        }
      };
    };

    const respuesta = {
      total: usuarios.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de modelos en preferencias y permisos de usuarios: ${resultados.length} errores`);
    return respuesta;
  } catch (error) {
    console.error('Error al verificar coleccion modelos en usuarios:', error);
  }
}

module.exports.checkDataConsistencyTipoUnidad = async function () {
  const TipoUnidad = mongoose.model('TipoUnidad');

  try {
    const tiposUnidad = await TipoUnidad.find().lean();
    const resultados = [];

    for (const tipo of tiposUnidad) {
      const current = {
        id: tipo._id,
        nombre: tipo.nombre,
        borrable: tipo.borrable,
        usuario: tipo.usuario
      };

     // Comprobacion de existencia del usuario asociado: si no tiene usuario es porque es un dato maestro y no se verifica
      if (current.usuario) {
        const existeUsuario = await mongoose.model('Usuario').exists({ _id: current.usuario });
        if (!existeUsuario) {
          resultados.push({
            id: current.id,
            nombre: current.nombre,
            mensaje: `tiene un usuario asociado que no existe: ${current.usuario}`
          });
        }
      }
    }

    const respuesta = {
      total: tiposUnidad.length,
      totalFallas: resultados.length,
      fallas: resultados
    }

    console.log(`Verificación completa de datos en tipos de unidad: ${respuesta.totalFallas} errores`);
    return respuesta;
  } catch (error) {
    console.error('Error al verificar coleccion equivalencias:', error);
  }
}