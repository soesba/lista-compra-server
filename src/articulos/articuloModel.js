"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const transform = require('../utils/commonFunctions').transform;

const ArticuloSchema = new Schema({
  nombre: {
    type: String,
    default: "",
    trim: true,
    required: true,
    index: true,
  },
  descripcion: {
    type: String,
    default: "",
    trim: true,
    index: true,
  },
  tiposUnidad: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TipoUnidad",
  }],
  tienePrecios: {
    type: Boolean,
    default: false
  },
  usuario: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  fechaCreacion: {
    type: Date,
    required: true,
  },
  borrable: {
    type: Boolean,
    default: true,
  },
});


ArticuloSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

// Ensure virtual fields are serialised.
ArticuloSchema.set('toJSON', {
  virtuals: true,
  versionKey: false, // oculta __v
  transform
});

ArticuloSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});


ArticuloSchema.pre("validate", function (next) {
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
ArticuloSchema.index({ usuario: 1 });
ArticuloSchema.index({ esMaestro: 1 });
module.exports = mongoose.model("Articulo", ArticuloSchema, "Articulo");
