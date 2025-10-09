'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
var usuarioController = require('./usuarioController');

module.exports = function (app) {

  app.route('/api/usuarios')
    .get(verifyToken, (req, res) => usuarioController.get(req, res) )         // Obtener usuarios
    .post(verifyToken, (req, res) => usuarioController.register(req, res))     // Registrar nuevo usuario
    .put(verifyToken, (req, res) => usuarioController.update(req, res));         // Actualizar usuario por ID

  app.route('/api/usuarios/:id')
    .delete(verifyToken, (req, res) => usuarioController.delete(req, res));     // Eliminar usuario por ID

}