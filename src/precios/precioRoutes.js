'use strict';

const compraController = require('./precioController');

module.exports = function (app) {

  app.get('/api/precios', compraController.get); // Obtener todos

  app.get('/api/precios/:id', compraController.getById); // Obtener por ID

  app.get('/api/precios/articulo/:articuloId', compraController.getByArticuloId); // Por artículo

  app.get('/api/precios/search/:texto', compraController.getByAny); // Búsqueda

  app.post('/api/precios', compraController.insert); // Crear nuevo

  app.put('/api/precios/:id', compraController.update); // Actualizar por ID

  app.delete('/api/precios/:id', compraController.delete); // Eliminar por ID

}