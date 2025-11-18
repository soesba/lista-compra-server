'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const EquivalenciaSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TipoUnidad"
  },
  factor: {
    type: Number,
    default: '1',
    required: true
  }
})

const TipoUnidadSchema = new Schema({
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
    equivalencias: [EquivalenciaSchema],
    fechaCreacion: {
        type: String,
        required: true
    },
    borrable: {
      type: Boolean,
      default: true
    },
    esMaestro: {
      type: Boolean,
      default: false
    }
});

// Duplicate the ID field.
TipoUnidadSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
EquivalenciaSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
TipoUnidadSchema.set('toJSON', {
  virtuals: true
});
EquivalenciaSchema.set('toJSON', {
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  },
});

TipoUnidadSchema.pre('validate', function(next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId()
  }
  if(!this.fechaCreacion) {
      this.fechaCreacion =  new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}).format()
  }
  next();
});

module.exports = mongoose.model('TipoUnidad', TipoUnidadSchema, 'TipoUnidad');
