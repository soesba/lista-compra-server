'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ImageSchema = require('../common/imageSchema.js')

const DireccionSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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

// Duplicate the ID field.
EstablecimientoSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

DireccionSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Ensure virtual fields are serialised.
EstablecimientoSchema.set('toJSON', {
  virtuals: true,
})

DireccionSchema.set('toJSON', {
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  },
});

EstablecimientoSchema.pre('validate', function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId()
  }
  if (this.tipoEstablecimiento) {
    this.tipoEstablecimiento = new mongoose.Types.ObjectId(`${this.tipoEstablecimiento}`)
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next()
})

// Índices simples
EstablecimientoSchema.index({ usuario: 1 });

module.exports = mongoose.model(
  'Establecimiento',
  EstablecimientoSchema,
  'Establecimiento'
)
