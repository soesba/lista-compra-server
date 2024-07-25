'use strict';

const compraController = require('./compraController');

module.exports = function (app) {

    app.route('/compra/get').get(compraController.get);

    app.route('/compra/getById/:id').get(compraController.getById);

    app.route('/compra/getByAny/:texto').get(compraController.getByAny);

    app.route('/compra/insert/').post(compraController.insert);

    app.route('/compra/update/').put(compraController.update);

    app.route('/compra/delete/:id').delete(compraController.delete);

}