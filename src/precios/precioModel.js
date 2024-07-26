"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UnidadMedidaSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TipoUnidad"
  },
  nombre:{
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  }
});

const PrecioSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
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
    type: String,
    required: true,
  },
  fechaCreacion: {
    type: String,
    required: true,
  },
  notas: {
    type: String,
    default: '',
  },
  borrable: {
    type: Boolean,
    default: true,
  }
});

// Duplicate the ID field.
PrecioSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
PrecioSchema.set('toJSON', {
  virtuals: true
});

PrecioSchema.pre("validate", function (next) {
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
  // if (this.fechaCompra) {
  //   this.fechaCompra = new Intl.DateTimeFormat('es-ES', {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   }).format(this.fechaCompra)
  // }
  next();
});

module.exports = mongoose.model("Precio", PrecioSchema, "Precio");
