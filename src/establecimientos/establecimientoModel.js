'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ImageSchema = require('../common/imageSchema.js')
const transform = require('../utils/commonFunctions').transform;

const DireccionSchema = new Schema({
  direccion: {
    type: String,
    required: true,
  },
  codPostal: {
    type: String,
    required: false,
  },
  poblacion: {
    type: String,
    required: false,
  },
  favorita: {
    type: Boolean,
    default: false,
  }
})

const EstablecimientoSchema = new Schema({
  tipoEstablecimiento: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'TipoEstablecimiento',
  },
  nombre: {
    type: String,
    default: '',
    trim: true,
    index: true,
  },
  logo: {
    type: ImageSchema,
    default: null,
  },
  notas: {
    type: String,
    default: '',
    trim: true,
    index: true,
  },
  direcciones: [DireccionSchema],
  fechaCreacion: {
    type: Date,
    required: true,
  },
  borrable: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true
  }
})

EstablecimientoSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

DireccionSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

EstablecimientoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

EstablecimientoSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

DireccionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

EstablecimientoSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

EstablecimientoSchema.pre('validate', function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (this.tipoEstablecimiento) {
    this.tipoEstablecimiento = new mongoose.Types.ObjectId(`${this.tipoEstablecimiento}`)
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next()
})

DireccionSchema.pre('validate', function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  next()
})

// Índices simples
EstablecimientoSchema.index({ usuario: 1 });

module.exports = mongoose.model('Establecimiento', EstablecimientoSchema, 'Establecimiento')
