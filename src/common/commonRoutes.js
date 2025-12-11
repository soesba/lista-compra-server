'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const commonController = require('./commonController');

module.exports = function (app) {
  app.post('/api/common/asignarUsuario', verifyToken, (req, res) => commonController.asignarUsuario(req, res)); // Asignar usuario
  app.post('/api/common/asignarRol', verifyToken, (req, res) => commonController.asignarRol(req, res)); // Asignar rol
};