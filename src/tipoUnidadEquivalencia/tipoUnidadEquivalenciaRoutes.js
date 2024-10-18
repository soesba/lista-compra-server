'use strict';

const tipoUnidadEquivalenciaController = require('./tipoUnidadEquivalenciaController');

module.exports = function (app) {

    app.route('/tipoUnidadEquivalencia/get').get(tipoUnidadEquivalenciaController.get);

    app.route('/tipoUnidadEquivalencia/getById/:id').get(tipoUnidadEquivalenciaController.getById);

    app.route('/tipoUnidadEquivalencia/getByFrom/:from').get(tipoUnidadEquivalenciaController.getByFrom);

    app.route('/tipoUnidadEquivalencia/getByFromMultiple/:from').get(tipoUnidadEquivalenciaController.getByFromMultiple);

    // app.route('/tipoUnidadEquivalencia/getDesplegable').get(tipoUnidadEquivalenciaController.getDesplegable);

    app.route('/tipoUnidadEquivalencia/insert/').post(tipoUnidadEquivalenciaController.insert);

    app.route('/tipoUnidadEquivalencia/update/').put(tipoUnidadEquivalenciaController.update);

    app.route('/tipoUnidadEquivalencia/delete/:id').delete(tipoUnidadEquivalenciaController.delete);

}