'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

var ConfiguracionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
ConfiguracionSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

ConfiguracionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});

ConfiguracionSchema.pre("validate", function (next) {
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

module.exports = mongoose.model('Configuracion', ConfiguracionSchema, 'Configuracion');
