'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const compraController = require('./precioController');

module.exports = function (app) {

  app.get('/api/precios/checkData', verifyToken, (req, res) => compraController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/precios/search/:texto', verifyToken, (req, res) => compraController.getByAny(req, res)); // Búsqueda

  app.get('/api/precios/articulo/:articuloId', verifyToken, (req, res) => compraController.getByArticuloId(req, res)); // Por artículo

  app.get('/api/precios/:id', verifyToken, (req, res) => compraController.getById(req, res)); // Obtener por ID

  app.get('/api/precios', verifyToken, (req, res) => compraController.get(req, res)); // Obtener todos

  app.post('/api/precios', verifyToken, (req, res) => compraController.insert(req, res)); // Crear nuevo

  app.put('/api/precios/:id', verifyToken, (req, res) => compraController.update(req, res)); // Actualizar por ID

  app.delete('/api/precios/:id', verifyToken, (req, res) => compraController.delete(req, res)); // Eliminar por ID

}