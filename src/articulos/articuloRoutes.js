'use strict';

const articuloController = require('./articuloController');

module.exports = function (app) {

    app.route('/articulo/get').get(articuloController.get);

    app.route('/articulo/getById/:id').get(articuloController.getById);

    app.route('/articulo/getByAny/:texto').get(articuloController.getByAny);

    app.route('/articulo/insert/').post(articuloController.insert);

    app.route('/articulo/update/').put(articuloController.update);

    app.route('/articulo/delete/:id').delete(articuloController.delete);

}