'use strict';

const tipoUnidadController = require('./tipoUnidadController');

module.exports = function (app) {

    app.route('/tipoUnidad/get').get(tipoUnidadController.get);

    app.route('/tipoUnidad/getById/:id').get(tipoUnidadController.getById);

    app.route('/tipoUnidad/getByAny/:texto').get(tipoUnidadController.getByAny);

    app.route('/tipoUnidad/insert/').post(tipoUnidadController.insert);

    app.route('/tipoUnidad/update/').put(tipoUnidadController.update);

    app.route('/tipoUnidad/delete/:id').delete(tipoUnidadController.delete);

}