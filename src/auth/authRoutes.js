'use strict';
const jwt = require("jsonwebtoken");
const authController = require('./authController');
const verifyToken =  require('../utils/verifyToken.js').verifyToken;

module.exports = function setupAuthRoutes(app) {

  app.post('/auth/login', authController.login); // Login

  app.post('/auth/register', authController.register); // Register

  app.get('/auth/refresh', authController.refreshToken); // Refresh token

  app.post('/auth/change-password', authController.changePassword); // Change password

  // Protected route example
  app.get("/protected", verifyToken, function (req, res) {
    return res.status(200).json({ message: "You have access" });
   });

}