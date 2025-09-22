'use strict';

const tipoEstablecimientoController = require('./tipoEstablecimientoController');

module.exports = function (app) {

  app.get('/api/tipo-establecimientos/desplegable', verifyToken, (req, res) => tipoEstablecimientoController.getDesplegable(req, res)); // Para dropdowns

  app.get('/api/tipo-establecimientos/search/:texto', verifyToken, (req, res) => tipoEstablecimientoController.getByAny(req, res)); // Buscar por texto

  app.get('/api/tipo-establecimientos/:id', verifyToken, (req, res) => tipoEstablecimientoController.getById(req, res)); // Obtener por ID

  app.get('/api/tipo-establecimientos', verifyToken, (req, res) => tipoEstablecimientoController.get(req, res)); // Obtener todos

  app.post('/api/tipo-establecimientos', verifyToken, (req, res) => tipoEstablecimientoController.insert(req, res)); // Crear nuevo

  app.put('/api/tipo-establecimientos/:id', verifyToken, (req, res) => tipoEstablecimientoController.update(req, res)); // Actualizar por ID

  app.delete('/api/tipo-establecimientos/:id', verifyToken, (req, res) => tipoEstablecimientoController.delete(req, res)); // Eliminar por ID

}