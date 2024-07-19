'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticuloSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    nombre: {
        type: String,
        default: '',
        trim: true,
        required: true,
        index: true
    },
    // nombreTicket: {
    //   type: String,
    //   default: '',
    //   trim: true
    // },
    descripcion: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    // tipoUnidad: {
    //   type: Schema.Types.ObjectId,
    //   default: '',
    //   trim: true,
    //   required: true
    // },
    // cantidad: {
    //   type: Number,
    //   required: true
    // },
    // precioUnidad: {
    //   type: Number,
    //   required: true
    // },
    // precioTotal: {
    //   type: Number,
    //   required: true
    // },
    fechaCreacion: {
        type: String,
        required: true
    },
    borrable: {
      type: Boolean,
      default: true
    }
});

// Devolvemos objeto con nombre campo id amigable
ArticuloSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

ArticuloSchema.pre('validate', function(next) {    
  console.log(this);
  if (!this._id) {
    this._id = mongoose.Types.ObjectId()
  }
  if(!this.fechaCreacion) {
      this.fechaCreacion =  new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}).format()
  }
  next();
});

module.exports = mongoose.model('Articulo', ArticuloSchema, 'Articulo');
