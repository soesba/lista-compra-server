'use strict';

const tipoUnidadController = require('./tipoUnidadController');

module.exports = function (app) {

    app.route('/tipoUnidades/').get(tipoUnidadController.get);

    app.route('/tipoUnidad/:id').get(tipoUnidadController.getById);

    app.route('/tipoUnidad/:id').delete(tipoUnidadController.delete);

}