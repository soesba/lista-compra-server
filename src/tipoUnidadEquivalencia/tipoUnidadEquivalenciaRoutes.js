'use strict';
const verifyToken = require('../utils/verifyToken.js').verifyToken;
const tipoUnidadEquivalenciaController = require('./tipoUnidadEquivalenciaController');

module.exports = function tipoUnidadEquivalenciaRoutes (app) {

  app.get('/api/tipos-unidad-equivalencia/checkData', verifyToken, (req, res) => tipoUnidadEquivalenciaController.checkData(req, res)); // Chequear consistencia de datos

  app.get('/api/tipos-unidad-equivalencia/search/:texto', verifyToken, (req, res) => tipoUnidadEquivalenciaController.getByAny(req, res)); // Buscar por texto

  app.get('/api/tipos-unidad-equivalencia/from/:from', verifyToken, (req, res) => tipoUnidadEquivalenciaController.getByFrom(req, res)); // Por unidad origen

  app.get('/api/tipos-unidad-equivalencia/from-multiple/:from', verifyToken, (req, res) => tipoUnidadEquivalenciaController.getByFromMultiple(req, res)); // Por múltiples unidades

  app.get('/api/tipos-unidad-equivalencia/:id', verifyToken, (req, res) => tipoUnidadEquivalenciaController.getById(req, res)); // Obtener por ID

  app.get('/api/tipos-unidad-equivalencia', verifyToken, (req, res) => tipoUnidadEquivalenciaController.get(req, res)); // Obtener todos

  app.post('/api/tipos-unidad-equivalencia', verifyToken, (req, res) => tipoUnidadEquivalenciaController.insert(req, res)); // Crear nuevo

  app.post('/api/tipos-unidad-equivalencia/save', verifyToken, (req, res) => tipoUnidadEquivalenciaController.save(req, res)); // Guardar (si es distinto de insert)

  app.put('/api/tipos-unidad-equivalencia/:id', verifyToken, (req, res) => tipoUnidadEquivalenciaController.update(req, res)); // Actualizar por ID

  app.delete('/api/tipos-unidad-equivalencia/:id', verifyToken, (req, res) => tipoUnidadEquivalenciaController.delete(req, res)); // Eliminar por ID

}