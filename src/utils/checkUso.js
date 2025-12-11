const mongoose = require('mongoose');

module.exports.checkUsoModelo = async function (modeloId) {
  const Usuario = mongoose.model('Usuario');
  const Modelo = mongoose.model('Modelo');

  const modelo = await Modelo.findById(modeloId);
  if (!modelo) {
    console.log(`El modelo con id ${modeloId} no existe.`);
    return;
  }

  try {
    let resultados = [];
    const usuarios = await Usuario.find({
      $or: [
        { 'preferencias.modeloId': modeloId },
        { 'permisos.modeloId': modeloId }
      ]
    },
    {
      _id: 1,
      nombre: 1,
      preferencias: 1,
      permisos: 1
    }).lean();
    resultados = resultados.concat(usuarios);
    const resultadosString = resultados.map(result => {
      const usuarioId = `Usuario ID: ${result._id}`;
      const nombre = `Nombre: ${result.nombre}`;
      const preferencias = result.preferencias.length > 0 ? 'Preferencias: Sí' : '';
      const permisos = result.permisos.length > 0 ? 'Permisos: Sí' : '';
      return `${usuarioId}, ${nombre}, ${preferencias}, ${permisos}`;
    })
    return resultadosString.length ? [ {
      entidad: 'Usuario',
      detalles: resultadosString
    }] : null;
  } catch (error) {
    console.error(`Error al comprobar uso del modelo ${modeloId}:`, error);
  }
}

module.exports.checkUsoTipoUnidad = async function (tipoUnidadId) {
  // Entidad a verificar
  const TipoUnidad = mongoose.model('TipoUnidad');
  // Entidades donde puede aparecer TipoUnidad
  const Articulo = mongoose.model('Articulo');
  const Precio = mongoose.model('Precio');

  try {
    let resultados = [];
    // Buscar en Articulo
    const articulos = await Articulo.find({ tipoUnidad: tipoUnidadId }, { _id: 1, nombre: 1 }).lean();
    resultados = resultados.concat(articulos.map(item => ({
      entidad: 'Articulo',
      id: item._id,
      nombre: item.nombre
    })));

    // Buscar en Precio
    const precios = await Precio.find({ tipoUnidad: tipoUnidadId }, { _id: 1, nombre: 1 }).lean();
    resultados = resultados.concat(precios.map(item => ({
      entidad: 'Precio',
      id: item._id,
      nombre: item.nombre
    })));
    resultados = resultados.map(item => {
      return `Entidad: ${item.entidad}, ID: ${item.id}, Nombre: ${item.nombre}`;
    });

    return resultados;
  } catch (error) {
    console.error(`Error al comprobar uso del tipo de unidad ${tipoUnidadId}:`, error);
  }
}

module.exports.checkUsoRol = async function (rolId) {
  // Entidad a verificar
  const Rol = mongoose.model('Rol');
  // Entidades donde puede aparecer el rol
  const Usuario = mongoose.model('Usuario');

  try {
    let resultados = [];
    // Buscar en Usuario
    const usuarios = await Usuario.find({ rol: rolId }, { _id: 1, nombre: 1 }).lean();
    resultados = resultados.concat(usuarios.map(item => ({
      entidad: 'Usuario',
      id: item._id,
      nombre: item.nombre
    })));
    resultados = resultados.map(item => {
      return `Entidad: ${item.entidad}, ID: ${item.id}, Nombre: ${item.nombre}`;
    });

    return resultados;
  } catch (error) {
    console.error(`Error al comprobar uso del rol ${rolId}:`, error);
  }
}