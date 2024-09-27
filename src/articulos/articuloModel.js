"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Precios = require('../precios/precioModel');

const ArticuloSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
  precios: [Precios.PrecioSchema],
  fechaCreacion: {
    type: String,
    required: true,
  },
  borrable: {
    type: Boolean,
    default: true,
  },
});

// Duplicate the ID field.
ArticuloSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
ArticuloSchema.set('toJSON', {
  virtuals: true
});

ArticuloSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = mongoose.Types.ObjectId();
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

module.exports = mongoose.model("Articulo", ArticuloSchema, "Articulo");
