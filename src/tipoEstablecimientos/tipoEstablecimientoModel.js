'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoEstablecimientoSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    nombre: {
        type: String,
        default: '',
        trim: true,
        required: true,
        index: true
    },
    abreviatura: {
      type: String,
      default: '',
      trim: true,
      required: true,
      index: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    borrable: {
      type: Boolean,
      default: true
    },
    esMaestro: {
      type: Boolean,
      default: false
    },
    usuario: {
      type: Schema.Types.ObjectId,
      required: true,
    }
});

// Duplicate the ID field.
TipoEstablecimientoSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
TipoEstablecimientoSchema.set('toJSON', {
  virtuals: true
});

TipoEstablecimientoSchema.pre('validate', function(next) {
    if (!this._id) {
      this._id = new mongoose.Types.ObjectId()
    }
    if(!this.fechaCreacion) {
        this.fechaCreacion = new Date();
    }
    next();
  });

// Índices simples
TipoEstablecimientoSchema.index({ usuario: 1 });
TipoEstablecimientoSchema.index({ esMaestro: 1 });

module.exports = mongoose.model('TipoEstablecimiento', TipoEstablecimientoSchema, 'TipoEstablecimiento');
