'use strict';
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'your-secret-key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret'; // Add a separate secret for refresh tokens

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
          if (!validPassword) return res.status(400).send('Contraseña incorrecta');
          // Generar un token JWT
          const token = jwt.sign({ username: response.username }, TOKEN_SECRET, { expiresIn: '1h' });
          // Generar un token de refresco
          const refreshToken = jwt.sign({ userId: response._id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
          res.send({ token, refreshToken });
        } else {
          res.status(401).send({ message: 'Nombre de usuario o contraseña incorrectos' });
        }
      })
      .catch(error => res.status(500).send({ message: error }));
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
