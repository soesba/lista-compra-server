'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
var usuarioController = require('./usuarioController');

module.exports = function (app) {

  app.route('/api/usuarios')
    .get(verifyToken, (req, res) => usuarioController.getAll(req, res) )         // Obtener todos los usuarios
    .post(verifyToken, (req, res) => usuarioController.register(req, res));     // Registrar nuevo usuario

  app.route('/api/usuarios/:id')
    .get(verifyToken, (req, res) => usuarioController.getById(req, res))        // Obtener usuario por ID
    .put(verifyToken, (req, res) => usuarioController.update(req, res))         // Actualizar usuario por ID
    .delete(verifyToken, (req, res) => usuarioController.delete(req, res));     // Eliminar usuario por ID

}