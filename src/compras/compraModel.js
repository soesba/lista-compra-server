"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CompraSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  factura: {
    type: String,
    default: '',
    index: true
  },
  totalCompra: {
    type: Number,
    default: 0
  },
  articulos: {
    type: Array,
    default: []
  },
  establecimiento: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Establecimiento",
  },
  fechaCompra: {
    type: String,
    required: true,
  },
  fechaCreacion: {
    type: String,
    required: true,
  },
  notas: {
    type: String,
    required: true,
  },
  borrable: {
    type: Boolean,
    default: true,
  },
});

// Duplicate the ID field.
CompraSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
CompraSchema.set('toJSON', {
  virtuals: true
});

CompraSchema.pre("validate", function (next) {
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

module.exports = mongoose.model("Compra", CompraSchema, "Compra");
