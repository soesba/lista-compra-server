'use strict';
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const Usuario = require('../usuarios/usuarioModel');

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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

module.exports.login = function (req, res) {
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos" });
    }
    Usuario.findOne({ username: username })
      .then(async (response) => {
        if (response) {
          // Verificar la contraseña
          const validPassword = await bcrypt.compare(password, response.password);
          if (!validPassword) return res.status(401).send({ message: 'Contraseña incorrecta' });
          // Generar un token JWT
          const token = jwt.sign({ username: response.username, id: response._id }, TOKEN_SECRET, { expiresIn: '1h' });
          // Generar un token de refresco
          const refreshToken = jwt.sign({ username: response.username, id: response._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
          const user = {
            username: response.username,
            esAdministrador: response.esAdministrador,
            permisos: response.permisos,
            preferencias: response.preferencias
          }
          res.send({ token, refreshToken, user });
        } else {
          res.status(401).send({ message: 'El usuario no existe' });
        }
      })
      .catch(error => res.status(500).send({ message: error.message }));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports.register = async function (req, res) {
  const { username, password } = req.body;

  // Verificar si el usuario ya existe
  const userExists = await Usuario.findOne({ username });
  if (userExists) return res.status(400).send('El usuario ya existe');

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar usuario en la base de datos simulada
  const newUser = new Usuario({ username, password: hashedPassword });
  await newUser.save();

  res.status(201).send('Usuario registrado exitosamente');
}

module.exports.refreshToken = async function (req, res) {
  try {
    const refreshToken = req.headers["x-refresh-token"];

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
      const payload = decoded;
      // Generar un nuevo token con el mismo payload
      const token = jwt.sign({ payload: payload.username, id: payload.id }, TOKEN_SECRET, { expiresIn: '1h' });
       // Generar un nuevo token de refresco
      const refreshToken = jwt.sign({ userId: payload.username, id: payload.id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

      res.json({ token, refreshToken, username: payload.username, id: payload.id});
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

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