
const mongoose = require('mongoose');

module.exports.accessFilter = function accessFilter (req, res, next) {
  if (!req.user?.id) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  const userId = req.user.id;
  const orClauses = [{ esMaestro: true }];

  if (mongoose.Types.ObjectId.isValid(userId)) {
    orClauses.unshift({ usuario: new mongoose.Types.ObjectId(`${userId}`) });
  }

  // Filtro de acceso común para las consultas
  req.accessFilter = { $or: orClauses };
  next();
};
