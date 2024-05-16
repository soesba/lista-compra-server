'use strict';

var establecimientoController = require('./establecimientoController');

module.exports = function (app) {

    app.route('/establecimientos/').get(establecimientoController.get);

    app.route('/establecimiento/:id').get(establecimientoController.getById);

    app.route('/establecimiento/:id').delete(establecimientoController.delete);

}