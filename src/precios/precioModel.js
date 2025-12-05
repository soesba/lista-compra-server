"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UnidadMedidaSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TipoUnidad"
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

// Duplicate the ID field.
PrecioSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});


UnidadMedidaSchema.virtual('id').get(function () {
  return this._id ? this._id.toHexString() : null;
});


// Ensure virtual fields are serialised.
PrecioSchema.set('toJSON', {
  virtuals: true,
  versionKey: true ,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});
PrecioSchema.set('toObject', {
  virtuals: true,
  versionKey: true
});

UnidadMedidaSchema.set('toJSON', {
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
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

PrecioSchema.post("aggregate", function (result) {
  for (const item of result) {
    item.id = item._id;
    delete item._id;
    delete item.__v
  }

})

// Índices simples
PrecioSchema.index({ usuario: 1 });

module.exports = mongoose.model("Precio", PrecioSchema, "Precio");
