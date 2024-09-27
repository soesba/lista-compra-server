'use strict';

const compraController = require('./precioController');

module.exports = function (app) {

    app.route('/precio/get').get(compraController.get);

    app.route('/precio/getById/:id').get(compraController.getById);

    app.route('/precio/getByAny/:texto').get(compraController.getByAny);    

    app.route('/precio/insert/').post(compraController.insert);

    app.route('/precio/update/').put(compraController.update);

    app.route('/precio/delete/:id').delete(compraController.delete);

}