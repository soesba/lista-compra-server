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
    return resultados;
  } catch (error) {
    console.error(`Error al comprobar uso del modelo ${modeloId}:`, error);
  }
}