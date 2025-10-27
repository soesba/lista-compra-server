'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const configuracionController = require('./configuracionController.js');

module.exports = function (app) {

  app.get('/api/configuracion', verifyToken, (req, res) => configuracionController.get(req, res)); // Obtener

  app.post('/api/configuracion', verifyToken, (req, res) => configuracionController.insert(req, res)); // Crear nuevo

  app.put('/api/configuracion/:id', verifyToken, (req, res) => configuracionController.update(req, res)); // Actualizar por ID

  app.delete('/api/configuracion/:id', verifyToken, (req, res) => configuracionController.delete(req, res)); // Eliminar por ID
}
