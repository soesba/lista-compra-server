'use strict';

const tipoUnidadController = require('./tipoUnidadController');

module.exports = function (app) {

    app.route('/tipoUnidad/').get(tipoUnidadController.get);

    app.route('/tipoUnidad/:id').get(tipoUnidadController.getById);

    app.route('/tipoUnidades/:texto').get(tipoUnidadController.getByAny);

    app.route('/tipoUnidad/:id').delete(tipoUnidadController.delete);

}