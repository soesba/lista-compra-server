'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const usuarioController = require('./usuarioController');

module.exports = function usuariosRoutes (app) {

  app.get('/api/usuarios/checkData', verifyToken, (req, res) => usuarioController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/usuarios/desplegable', verifyToken, (req, res) => usuarioController.getDesplegable(req, res)); // Para dropdowns

  app.route('/api/usuarios')
    .get(verifyToken, (req, res) => usuarioController.get(req, res) )         // Obtener usuarios
    .post(verifyToken, (req, res) => usuarioController.register(req, res))     // Registrar nuevo usuario
    .put(verifyToken, (req, res) => usuarioController.update(req, res));         // Actualizar usuario por ID

  app.route('/api/usuarios/preferencias/:id')
    .get(verifyToken, (req, res) => usuarioController.getPreferencias(req, res)); // Obtener configuracion de usuario

    app.route('/api/usuarios/foto')
    .get(verifyToken, (req, res) => usuarioController.getFoto(req, res)); // Obtener foto del usuario

  app.route('/api/usuarios/:id')
    .delete(verifyToken, (req, res) => usuarioController.delete(req, res));     // Eliminar usuario por ID

}