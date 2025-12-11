"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { transform, postAggregate } = require('../utils/commonFunctions');

const UnidadMedidaSchema = new Schema({
  valor: {
    type: Number,
    required: true
  }
});

const PrecioSchema = new Schema({
  articulo: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Articulo"
  },
  precio: {
    type: Number,
    default: 0
  },
  marca: {
    type: String,
    default: 0
  },
  establecimiento: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Establecimiento",
  },
  unidadesMedida: {
    type: [UnidadMedidaSchema]
  },
  fechaCompra: {
    type: Date,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    required: true,
  },
  notas: {
    type: String,
    default: '',
  },
  borrable: {
    type: Boolean,
    default: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
  }
});

PrecioSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});


UnidadMedidaSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});


PrecioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});
PrecioSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

UnidadMedidaSchema.set('toJSON', {
   virtuals: true,
  versionKey: false,
  transform
});

UnidadMedidaSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

PrecioSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date()
  }
  next();
});

PrecioSchema.post("aggregate", (result) => postAggregate(result))

// Índices simples
PrecioSchema.index({ usuario: 1 });

module.exports = mongoose.model("Precio", PrecioSchema, "Precio");
