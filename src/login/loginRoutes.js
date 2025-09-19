'use strict';
const jwt = require("jsonwebtoken");
var loginController = require('./loginController');

// Middleware para verificar el token JWT
function verifyToken(req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Acceso denegado');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next(); // Continuar con la solicitud
  } catch (err) {
    res.status(400).send('Token inválido');
  }
}

module.exports = function (app) {

  app.post('/login', loginController.login); // Login

  app.post('/register', loginController.register); // Register

  // Protected route
  app.get("/protected", verifyToken,  (req, res) => {
    return res.status(200).json({ message: "You have access" });
   });

}