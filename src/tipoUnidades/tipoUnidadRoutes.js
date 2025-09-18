'use strict';

const tipoUnidadController = require('./tipoUnidadController');

module.exports = function (app) {

  app.get('/api/tipos-unidad/desplegable', tipoUnidadController.getDesplegable); // Para dropdowns

  app.get('/api/tipos-unidad/search/:texto', tipoUnidadController.getByAny); // Buscar por texto

  app.get('/api/tipos-unidad/:id', tipoUnidadController.getById); // Obtener por ID

  app.get('/api/tipos-unidad', tipoUnidadController.get); // Obtener todos

  app.post('/api/tipos-unidad', tipoUnidadController.insert); // Crear nuevo

  app.put('/api/tipos-unidad/:id', tipoUnidadController.update); // Actualizar por ID

  app.delete('/api/tipos-unidad/:id', tipoUnidadController.delete); // Eliminar por ID

}