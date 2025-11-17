'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const tipoUnidadController = require('./tipoUnidadController');

module.exports = function (app) {

  app.get('/api/tipos-unidad/desplegable', verifyToken, (req, res) => tipoUnidadController.getDesplegable(req, res)); // Para dropdowns

  app.get('/api/tipos-unidad/search/:texto', verifyToken, (req, res) => tipoUnidadController.getByAny(req, res)); // Buscar por texto

  app.get('/api/tipos-unidad/:id', verifyToken, (req, res) => tipoUnidadController.getById(req, res)); // Obtener por ID

  app.get('/api/tipos-unidad', verifyToken, (req, res) => tipoUnidadController.get(req, res)); // Obtener todos

  app.post('/api/tipos-unidad', verifyToken, (req, res) => tipoUnidadController.insert(req, res)); // Crear nuevo

  app.put('/api/tipos-unidad/:id', verifyToken, (req, res) => tipoUnidadController.update(req, res)); // Actualizar por ID

  app.delete('/api/tipos-unidad/:id', verifyToken, (req, res) => tipoUnidadController.delete(req, res)); // Eliminar por ID

  app.get('/api/tipos-unidad/checkuso/:id', verifyToken, (req, res) => tipoUnidadController.checkUso(req, res)); // Comprobar uso antes de eliminar

}