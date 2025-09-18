'use strict';

const establecimientoController = require('./establecimientoController');

module.exports = function (app) {

  app.get('/api/establecimientos/desplegable', establecimientoController.getDesplegable); // Para dropdowns

  app.get('/api/establecimientos/search/:texto', establecimientoController.getByAny); // Buscar por texto

  app.get('/api/establecimientos/:id', establecimientoController.getById); // Obtener por ID

  app.get('/api/establecimientos', establecimientoController.get); // Obtener todos

  app.post('/api/establecimientos', establecimientoController.insert); // Crear nuevo

  app.put('/api/establecimientos/:id', establecimientoController.update); // Actualizar por ID

  app.delete('/api/establecimientos/:id', establecimientoController.delete); // Eliminar por ID

}