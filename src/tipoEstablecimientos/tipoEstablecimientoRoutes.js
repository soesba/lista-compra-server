'use strict';

const tipoEstablecimientoController = require('./tipoEstablecimientoController');

module.exports = function (app) {

    app.route('/tipoEstablecimiento/get').get(tipoEstablecimientoController.get);

    app.route('/tipoEstablecimiento/getById/:id').get(tipoEstablecimientoController.getById);

    app.route('/tipoEstablecimiento/getByAny/:texto').get(tipoEstablecimientoController.getByAny);

    app.route('/tipoEstablecimiento/getDesplegable').get(tipoEstablecimientoController.getDesplegable);

    app.route('/tipoEstablecimiento/insert/').post(tipoEstablecimientoController.insert);

    app.route('/tipoEstablecimiento/update/').put(tipoEstablecimientoController.update);

    app.route('/tipoEstablecimiento/delete/:id').delete(tipoEstablecimientoController.delete);

}