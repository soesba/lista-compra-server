'use strict';
const jwt = require("jsonwebtoken");
var loginController = require('./authController');
const verifyToken =  require('../utils/verifyToken.js').verifyToken;

module.exports = function (app) {

  app.post('/login', loginController.login); // Login

  app.post('/register', loginController.register); // Register

  app.get('/refresh', loginController.refreshToken); // Refresh token

  // Protected route
  app.get("/protected", verifyToken, function (req, res) {
    return res.status(200).json({ message: "You have access" });
   });

}