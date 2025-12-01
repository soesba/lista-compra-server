'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const rolController = require('./rolController');

module.exports = function rolRoutes(app) {

  app.route('/api/roles/desplegable')
    .get(verifyToken, (req, res) => rolController.getDesplegable(req, res)); // Para dropdowns

  app.route('/api/roles')
    .get(verifyToken, (req, res) => rolController.get(req, res)) // Obtener
    .post(verifyToken, (req, res) => rolController.insert(req, res)); // Crear nuevo

  app.route('/api/roles/checkuso/:id')
    .get(verifyToken, (req, res) => rolController.checkUso(req, res));

  app.route('/api/roles/:id')
    .put(verifyToken, (req, res) => rolController.update(req, res)) // Actualizar por ID
    .delete(verifyToken, (req, res) => rolController.delete(req, res)); // Eliminar por ID
}
