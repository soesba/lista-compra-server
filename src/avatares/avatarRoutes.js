'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
var avatarController = require('./avatarController');

module.exports = function (app) {

  app.route('/api/avatares')
    .get(verifyToken, (req, res) => avatarController.getAll(req, res) )         // Obtener todos los avatares
    .post(verifyToken, (req, res) => avatarController.insert(req, res));     // Crear nuevo avatar
    // Avatares no se actualizan: se crean o se eliminan
    // .put(verifyToken, (req, res) => avatarController.update(req, res));         // Actualizar avatar por ID

  app.route('/api/avatares/:id')
    .get(verifyToken, (req, res) => avatarController.getById(req, res))     // Obtener avatar por ID
    .delete(verifyToken, (req, res) => avatarController.delete(req, res));     // Eliminar avatar por ID

}