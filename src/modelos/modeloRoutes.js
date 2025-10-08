'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const modeloController = require('./modeloController');

module.exports = function (app) {

  app.get('/api/modelos/:id', verifyToken, (req, res) => modeloController.getById(req, res)); // Obtener por ID

  app.get('/api/modelos', verifyToken, (req, res) => modeloController.get(req, res)); // Obtener todos

  app.post('/api/modelos', verifyToken, (req, res) => modeloController.insert(req, res)); // Crear nuevo

  app.put('/api/modelos/:id', verifyToken, (req, res) => modeloController.update(req, res)); // Actualizar por ID

  app.delete('/api/modelos/:id', verifyToken, (req, res) => modeloController.delete(req, res)); // Eliminar por ID
}
