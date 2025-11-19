'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ImageSchema = require('../common/imageSchema.js')

var DireccionSchema = new Schema({
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

var EstablecimientoSchema = new Schema({
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
    type: String,
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
    this.fechaCreacion = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format()
  }
  next()
})

module.exports = mongoose.model(
  'Establecimiento',
  EstablecimientoSchema,
  'Establecimiento'
)
