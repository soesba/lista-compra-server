const jwt = require("jsonwebtoken");

function isTokenExpired (token) {
  if (!token) return true;
  try {
    const decodedToken = jwt.decode(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Middleware para verificar el token JWT
module.exports.verifyToken = function (req, res, next) {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;
  const header = req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) return res.status(401).send('Acceso denegado');
  if (isTokenExpired(token)) {
    return res.status(401).send('Token expirado');
  }
  try {
    const payload = jwt.verify(token, TOKEN_SECRET);
    req.user = payload;
    next(); // Continuar con la solicitud
  } catch (err) {
    res.status(400).send('Token inválido');
  }
}
