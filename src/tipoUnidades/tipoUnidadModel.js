'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const transform = require('../utils/commonFunctions').transform;

const EquivalenciaSchema = new Schema({
  _id: false,
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
    required: function() {
      return this.esMaestro === false;
     }
  }
});

TipoUnidadSchema.plugin(mongooseLeanVirtuals);
EquivalenciaSchema.plugin(mongooseLeanVirtuals);


TipoUnidadSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});


// Ensure virtual fields are serialised.
TipoUnidadSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

TipoUnidadSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

EquivalenciaSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

EquivalenciaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

TipoUnidadSchema.pre('validate', function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next();
});


// Índices simples
TipoUnidadSchema.index({ usuario: 1 });
TipoUnidadSchema.index({ esMaestro: 1 });

module.exports = mongoose.model('TipoUnidad', TipoUnidadSchema, 'TipoUnidad');
