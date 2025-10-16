'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const modeloController = require('./modeloController');

module.exports = function (app) {

  app.route('/api/modelos')
    .get(verifyToken, (req, res) => modeloController.get(req, res)) // Obtener
    .post(verifyToken, (req, res) => modeloController.insert(req, res)); // Crear nuevo

  app.route('/api/modelos/:id')
    .put(verifyToken, (req, res) => modeloController.update(req, res)) // Actualizar por ID
    .delete(verifyToken, (req, res) => modeloController.delete(req, res)); // Eliminar por ID
}
