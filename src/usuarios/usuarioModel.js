'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

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
	password: {
		type: String,
		default: ''
	},
	fechaCreacion: {
		type: String,
		default: Date.now
	}
});

// Duplicate the ID field.
UsuarioSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

UsuarioSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});

UsuarioSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = mongoose.Types.ObjectId();
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
