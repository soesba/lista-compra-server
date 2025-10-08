'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

var ModeloSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  nombre: {
    type: String,
    required: true
  }
});

// Duplicate the ID field.
ModeloSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

ModeloSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});

ModeloSchema.pre("validate", function (next) {
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

module.exports = mongoose.model('Modelo', ModeloSchema, 'Modelo');
