const jwt = require("jsonwebtoken");

// Middleware para verificar el token JWT
module.exports.verifyToken = function (req, res, next) {
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) return res.status(401).send('Acceso denegado');

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next(); // Continuar con la solicitud
  } catch (err) {
    res.status(400).send('Token inválido');
  }
}
