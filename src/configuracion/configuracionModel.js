'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transform = require('../utils/commonFunctions').transform;

const ConfiguracionSchema = new Schema({
  categoria: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  valores: {
    type: Array,
    required: true
  },
  valorDefecto: {
    type: String,
    required: true
  }
});

// Duplicate the ID field.
ConfiguracionSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

ConfiguracionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

ConfiguracionSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

ConfiguracionSchema.pre("validate", function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Configuracion', ConfiguracionSchema, 'Configuracion');
