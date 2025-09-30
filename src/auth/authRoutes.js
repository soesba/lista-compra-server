'use strict';
const jwt = require("jsonwebtoken");
var loginController = require('./authController');
const verifyToken =  require('../utils/verifyToken.js').verifyToken;

module.exports = function (app) {

  app.post('/auth/login', loginController.login); // Login

  app.post('/auth/register', loginController.register); // Register

  app.get('/auth/refresh', loginController.refreshToken); // Refresh token

  // app.post('/auth/changePassword', loginController.changePassword); // Change password

  // Protected route example
  app.get("/protected", verifyToken, function (req, res) {
    return res.status(200).json({ message: "You have access" });
   });

}