'use strict';

const tipoEstablecimientoController = require('./tipoEstablecimientoController');

module.exports = function (app) {

    app.route('/tipoEstablecimientos/').get(tipoEstablecimientoController.get);

    app.route('/tipoEstablecimiento/:id').get(tipoEstablecimientoController.getById);

    app.route('/tipoEstablecimiento/:id').delete(tipoEstablecimientoController.delete);

}