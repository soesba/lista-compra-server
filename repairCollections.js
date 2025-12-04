'use strict';

const mongoose = require('mongoose');

module.exports.repairCollections = async function () {
  await repairFechaCreacion(mongoose.model('Articulo'));
  await repairFechaCreacion(mongoose.model('TipoUnidad'));
  await repairFechaCreacion(mongoose.model('TipoEstablecimiento'));
  await repairFechaCreacion(mongoose.model('Establecimiento'));
  await repairFechaCreacion(mongoose.model('Precio'));
  await repairFechaCreacion(mongoose.model('Usuario'));
  await repairFechaCreacion(mongoose.model('Rol'));
  await repairFechaCompra(mongoose.model('Precio'));
  await repairFechaSubida(mongoose.model('Avatar'));
}

async function repairFechaCreacion (model) {
  try {
    await model.updateMany(
      {
        fechaCreacion: { $exists: true, $type: "string" }
      },
      [
        {
          $set: {
            fechaCreacion: {
              $dateFromString: {
                dateString: "$fechaCreacion",
                format: "%d/%m/%Y",
                timezone: "Europe/Madrid", // opcional
                onError: "$fechaCreacion",  // deja el valor original si falla
                onNull: "$fechaCreacion"
              }
            }
          }
        }
      ]
    );
  } catch (err) {
    console.error("Error reparando fechaCreacion:", err, "en modelo:", model.modelName);
    throw err;
  }
}

async function repairFechaSubida (model) {
  try {
    await model.updateMany(
      {
        fechaSubida: { $exists: true, $type: "string" }
      },
      [
        {
          $set: {
            fechaSubida: {
              $dateFromString: {
                dateString: "$fechaSubida",
                format: "%d/%m/%Y",
                timezone: "Europe/Madrid", // opcional
                onError: "$fechaSubida",  // deja el valor original si falla
                onNull: "$fechaSubida"
              }
            }
          }
        }
      ]
    );
  } catch (err) {
    console.error("Error reparando fechaSubida:", err, "en modelo:", model.modelName);
    throw err;
  }
}

async function repairFechaCompra (model) {
  try {
    await model.updateMany(
      {
        fechaCompra: { $exists: true, $type: "string" }
      },
      [
        {
          $set: {
            fechaCompra: {
              $dateFromString: {
                dateString: "$fechaCompra",
                format: "%d/%m/%Y",
                timezone: "Europe/Madrid", // opcional
                onError: "$fechaCompra",  // deja el valor original si falla
                onNull: "$fechaCompra"
              }
            }
          }
        }
      ]
    );
  } catch (err) {
    console.error("Error reparando fechaCompra:", err, "en modelo:", model.modelName);
    throw err;
  }
}