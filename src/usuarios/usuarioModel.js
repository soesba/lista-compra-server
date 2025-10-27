'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var ImageSchema = require('../common/imageSchema.js');

var PermisoSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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

var PreferenciaUserSchema = new Schema({
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

var UsuarioSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
	username: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
  nombre: {
    type: String,
    required: true
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
		type: String,
    required: true
	},
  esAdministrador: {
    type: Boolean,
    default: false
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
UsuarioSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

PreferenciaUserSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

UsuarioSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id
    }
  }
});

UsuarioSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format();
  }
  next();
});

module.exports = mongoose.model('Usuario', UsuarioSchema, 'Usuario');
