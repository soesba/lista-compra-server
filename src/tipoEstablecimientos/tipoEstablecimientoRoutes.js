'use strict';

const tipoEstablecimientoController = require('./tipoEstablecimientoController');

module.exports = function (app) {

  app.get('/api/tipo-establecimientos/desplegable', tipoEstablecimientoController.getDesplegable); // Para dropdowns

  app.get('/api/tipo-establecimientos/search/:texto', tipoEstablecimientoController.getByAny); // Buscar por texto

  app.get('/api/tipo-establecimientos/:id', tipoEstablecimientoController.getById); // Obtener por ID

  app.get('/api/tipo-establecimientos', tipoEstablecimientoController.get); // Obtener todos

  app.post('/api/tipo-establecimientos', tipoEstablecimientoController.insert); // Crear nuevo

  app.put('/api/tipo-establecimientos/:id', tipoEstablecimientoController.update); // Actualizar por ID

  app.delete('/api/tipo-establecimientos/:id', tipoEstablecimientoController.delete); // Eliminar por ID

}