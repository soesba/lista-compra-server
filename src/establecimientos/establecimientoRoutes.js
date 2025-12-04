'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const accessFilter = require('../middleware/accesFilterController.js').accessFilter;
const establecimientoController = require('./establecimientoController');

module.exports = function (app) {

  app.get('/api/establecimientos/checkData', verifyToken, (req, res) => establecimientoController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/establecimientos/desplegable', verifyToken, accessFilter, (req, res) => establecimientoController.getDesplegable(req, res)); // Para dropdowns

  app.get('/api/establecimientos/search/:texto', verifyToken, accessFilter, (req, res) => establecimientoController.getByAny(req, res)); // Buscar por texto

  app.get('/api/establecimientos/:id', verifyToken, accessFilter, (req, res) => establecimientoController.getById(req, res)); // Obtener por ID

  app.get('/api/establecimientos', verifyToken, accessFilter, (req, res) => establecimientoController.get(req, res)); // Obtener todos

  app.post('/api/establecimientos', verifyToken, (req, res) => establecimientoController.insert(req, res)); // Crear nuevo

  app.put('/api/establecimientos/:id', verifyToken, (req, res) => establecimientoController.update(req, res)); // Actualizar por ID

  app.delete('/api/establecimientos/:id', verifyToken, (req, res) => establecimientoController.delete(req, res)); // Eliminar por ID

}