'use strict';

const tipoUnidadEquivalenciaController = require('./tipoUnidadEquivalenciaController');

module.exports = function (app) {

    app.get('/api/tipos-unidad-equivalencia', tipoUnidadEquivalenciaController.get); // Obtener todos

    app.get('/api/tipos-unidad-equivalencia/:id', tipoUnidadEquivalenciaController.getById); // Obtener por ID

    app.get('/api/tipos-unidad-equivalencia/from/:from', tipoUnidadEquivalenciaController.getByFrom); // Por unidad origen

    app.get('/api/tipos-unidad-equivalencia/from-multiple/:from', tipoUnidadEquivalenciaController.getByFromMultiple); // Por múltiples unidades

    app.post('/api/tipos-unidad-equivalencia', tipoUnidadEquivalenciaController.insert); // Crear nuevo

    app.post('/api/tipos-unidad-equivalencia/save', tipoUnidadEquivalenciaController.save); // Guardar (si es distinto de insert)

    app.put('/api/tipos-unidad-equivalencia/:id', tipoUnidadEquivalenciaController.update); // Actualizar por ID

    app.delete('/api/tipos-unidad-equivalencia/:id', tipoUnidadEquivalenciaController.delete); // Eliminar por ID

}