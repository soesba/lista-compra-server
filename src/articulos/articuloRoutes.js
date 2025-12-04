'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const accessFilter = require('../middleware/accesFilterController.js').accessFilter;
const articuloController = require('./articuloController');

module.exports = function articuloRoutes (app) {

  app.get('/api/articulos/checkData', verifyToken, (req, res) => articuloController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/articulos/desplegable', verifyToken, accessFilter, (req, res) => articuloController.getDesplegable(req, res)); // Para dropdowns

  app.get('/api/articulos/search/:texto', verifyToken, accessFilter, (req, res) => articuloController.getByAny(req, res)); // Buscar por texto

  app.get('/api/articulos/:id', verifyToken, accessFilter, (req, res) => articuloController.getById(req, res)); // Obtener por ID

  app.get('/api/articulos', verifyToken, accessFilter, (req, res) => articuloController.get(req, res)); // Obtener todos

  app.post('/api/articulos', verifyToken, (req, res) => articuloController.insert(req, res)); // Crear nuevo

  app.put('/api/articulos/:id', verifyToken, (req, res) => articuloController.update(req, res)); // Actualizar por ID

  app.delete('/api/articulos/:id', verifyToken, (req, res) => articuloController.delete(req, res)); // Eliminar por ID
}
