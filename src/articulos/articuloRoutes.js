'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const articuloController = require('./articuloController');

module.exports = function articuloRoutes (app) {

  app.get('/api/articulos/checkData', verifyToken, (req, res) => articuloController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/articulos/desplegable', verifyToken, (req, res) => articuloController.getDesplegable(req, res)); // Para dropdowns

  app.get('/api/articulos/search/:texto', verifyToken, (req, res) => articuloController.getByAny(req, res)); // Buscar por texto

  app.get('/api/articulos/:id', verifyToken, (req, res) => articuloController.getById(req, res)); // Obtener por ID

  app.get('/api/articulos', verifyToken, (req, res) => articuloController.get(req, res)); // Obtener todos

  app.post('/api/articulos', verifyToken, (req, res) => articuloController.insert(req, res)); // Crear nuevo

  app.put('/api/articulos/:id', verifyToken, (req, res) => articuloController.update(req, res)); // Actualizar por ID

  app.delete('/api/articulos/:id', verifyToken, (req, res) => articuloController.delete(req, res)); // Eliminar por ID
}
