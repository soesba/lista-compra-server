'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ImageSchema = require('../common/imageSchema.js');
const transform = require('../utils/commonFunctions').transform;

const PermisoSchema = new Schema({
  modeloId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  acceso: {
    type: Boolean,
    default: false
  },
  permiso: {
    type: String, // CRUD: Create, Read, Update, Delete o combinaciones como CR, CRU, CRUD
    required: true
  }
});

const PreferenciaUserSchema = new Schema({
  configuracionId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  modeloId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  valor: {
    type: String,
    required: true
  }
});

const UsuarioSchema = new Schema({
  rol: {
    type: Schema.Types.ObjectId,
    ref: 'Rol',
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
  },
  primerApellido: {
    type: String
  },
  segundoApellido: {
    type: String
  },
  foto: {
    type: ImageSchema,
    default: null,
  },
  password: {
    type: String,
    default: ''
  },
  fechaCreacion: {
    type: Date,
    required: true
  },
  permisos: {
    type: [PermisoSchema],
    default: null
  },
  preferencias: {
    type: [PreferenciaUserSchema],
    default: null
  }
});

// Duplicate the ID field.
UsuarioSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

UsuarioSchema.virtual('esAdministrador').get(function () {
  // El campo rol debe estar relleno
  return this.rol && this.rol.nombre?.toLowerCase() === 'administrador';
});


PreferenciaUserSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

UsuarioSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

UsuarioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

PreferenciaUserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

PreferenciaUserSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

UsuarioSchema.pre("validate", function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'Usuario');
