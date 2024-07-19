'use strict';

const establecimientoController = require('./establecimientoController');

module.exports = function (app) {

    app.route('/establecimiento/get').get(establecimientoController.get);

    app.route('/establecimiento/getById/:id').get(establecimientoController.getById);

    app.route('/establecimiento/getByAny/:texto').get(establecimientoController.getByAny);

    app.route('/establecimiento/insert/').post(establecimientoController.insert);

    app.route('/establecimiento/update/').put(establecimientoController.update);

    app.route('/establecimiento/delete/:id').delete(establecimientoController.delete);

}