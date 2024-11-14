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
PrecioSchema.virtual('id').get(function () {
  return this._id.toHexString();
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

PrecioSchema.pre("find", function (next) {
  this
  .populate("establecimiento", "_id nombre")
  .populate("articulo", "_id nombre");
  next();
})

PrecioSchema.post("aggregate", function (result) {
  result.forEach(item => {
    item.id = item._id;
    delete item._id;
    delete item.__v
  })
  
})

module.exports = mongoose.model("Precio", PrecioSchema, "Precio");
