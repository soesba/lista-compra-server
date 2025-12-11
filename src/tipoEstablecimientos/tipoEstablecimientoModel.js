'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transform = require('../utils/commonFunctions').transform;

const TipoEstablecimientoSchema = new Schema({
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


TipoEstablecimientoSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

TipoEstablecimientoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

TipoEstablecimientoSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

TipoEstablecimientoSchema.pre('validate', function(next) {
    if (!this._id && this.id) {
      this._id = new mongoose.Types.ObjectId(`${this.id}`);
      delete this.id;
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
