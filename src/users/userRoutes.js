'use strict';

var userController = require('./userController');

module.exports = function (app) {

    app.route('/users/authenticate')
        .post(userController.authenticate);

    app.route('/users/register')
        .post(userController.register);
        
    app.route('/users/')
        .get(userController.getAll);

    app.route('/users/:id')
        .get(userController.getById);

    app.route('/users/updateFollowing/:id')
        .put(userController.updateFollowing);

    app.route('/users/update/:id')
        .put(userController.update);
    
    app.route('/users/delete/:id')
        .delete(userController.delete);
}