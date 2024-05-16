'use strict';

const articuloController = require('./articuloController');

module.exports = function (app) {

    app.route('/articulos/').get(articuloController.get);

    app.route('/articulo/:id').get(articuloController.getById);

    app.route('/articulo/:id').delete(articuloController.delete);

}