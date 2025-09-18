'use strict';

const articuloController = require('./articuloController');

module.exports = function (app) {

  app.get('/api/articulos/desplegable', articuloController.getDesplegable); // Para dropdowns

  app.get('/api/articulos/search/:texto', articuloController.getByAny); // Buscar por texto

  app.get('/api/articulos/:id', articuloController.getById); // Obtener por ID

  app.get('/api/articulos', articuloController.get); // Obtener todos

  app.post('/api/articulos', articuloController.insert); // Crear nuevo

  app.put('/api/articulos/:id', articuloController.update); // Actualizar por ID

  app.delete('/api/articulos/:id', articuloController.delete); // Eliminar por ID
}
