'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const accessFilter = require('../middleware/accesFilterController.js').accessFilter;
const precioController = require('./precioController');

module.exports = function (app) {

  app.get('/api/precios/checkData', verifyToken, (req, res) => precioController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/precios/search/:texto', verifyToken, accessFilter, (req, res) => precioController.getByAny(req, res)); // Búsqueda

  app.get('/api/precios/articulo/:articuloId', verifyToken, accessFilter, (req, res) => precioController.getByArticuloId(req, res)); // Por artículo

  app.get('/api/precios/:id', verifyToken, accessFilter, (req, res) => precioController.getById(req, res)); // Obtener por ID

  app.get('/api/precios', verifyToken, accessFilter, (req, res) => precioController.get(req, res)); // Obtener todos

  app.post('/api/precios', verifyToken, (req, res) => precioController.insert(req, res)); // Crear nuevo

  app.put('/api/precios/:id/unidadesMedida', verifyToken, (req, res) => precioController.updateUnidadesMedida(req, res)); // Actualizar unidades de medida por ID

  app.put('/api/precios/:id', verifyToken, (req, res) => precioController.update(req, res)); // Actualizar por ID

  app.delete('/api/precios/:id', verifyToken, (req, res) => precioController.delete(req, res)); // Eliminar por ID

}