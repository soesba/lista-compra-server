'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const ArticuloSchema = new Schema({
    // _id: {
    //     type: Schema.Types.ObjectId,
    //     required: true
    // },
    nombre: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    nombreTicket: {
      type: String,
      default: '',
      trim: true
    },
    descripcion: {
      type: String,
      default: '',
      trim: true
    },
    tipoUnidad: {
      type: Schema.Types.ObjectId,
      default: '',
      trim: true,
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    },
    precioUnidad: {
      type: Number,
      required: true
    },
    precioTotal: {
      type: Number,
      required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    }
});

// ArticuloSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     object.fechaCreacion = moment(this.created).format('DD/MM/YYYY');
//     return object;
// });

ArticuloSchema.pre('validate', function(next) {    
  console.log(this);
  if (this._id) {
    this._id = mongoose.Types.ObjectId(this._id)
  }
  if(!this.fechaCreacion) {
      this.fechaCreacion =  moment(new Date()).format('YYYY-MM-DD')
  }
  next();
});

module.exports = mongoose.model('Articulo', ArticuloSchema, 'Articulo');
