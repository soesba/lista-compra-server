'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const TipoUnidadSchema = new Schema({
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
    abreviatura: {
      type: String,
      default: '',
      trim: true,
      required: true,
      index: true
    // },
    // fechaCreacion: {
    //     type: Date,
    //     required: true
    },
    borrable: {
      type: Boolean,
      default: true
    }
});

// Devolvemos objeto con nombre campo id amigable
TipoUnidadSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

TipoUnidadSchema.pre('validate', function(next) {    
  console.log(this);
  if (!this._id) {
    this._id = mongoose.Types.ObjectId()
  }
  if(!this.fechaCreacion) {
      this.fechaCreacion =  moment(new Date()).format('YYYY-MM-DD')
  }
  next();
});

TipoUnidadSchema.index({ '$**': 'text' });
module.exports = mongoose.model('TipoUnidad', TipoUnidadSchema, 'TipoUnidad');
