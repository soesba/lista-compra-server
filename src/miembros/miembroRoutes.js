'use strict';

var miembroController = require('./miembroController');

module.exports = function (app) {

    app.route('/miembros/').get(miembroController.get);

    app.route('/miembro/:id').get(miembroController.getById);

    app.route('/miembro/:id').delete(miembroController.delete);

}