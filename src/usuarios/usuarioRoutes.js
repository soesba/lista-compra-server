'use strict';
 const verifyToken = require('../utils/verifyToken.js').verifyToken;
var usuarioController = require('./usuarioController');

module.exports = function (app) {

  app.route('/api/usuarios')
    .get(verifyToken, (req, res) => usuarioController.getAll)         // Obtener todos los usuarios
    .post(usuarioController.register);     // Registrar nuevo usuario

  app.route('/api/usuarios/:id')
    .get(usuarioController.getById)        // Obtener usuario por ID
    .put(usuarioController.update)         // Actualizar usuario por ID
    .delete(usuarioController.delete);     // Eliminar usuario por ID

}