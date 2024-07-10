'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

const TipoEstablecimientoSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    nombre: {
        type: String,
        default: '',
        trim: true,
        required: true
    },
    abreviatura: {
      type: String,
      default: '',
      trim: true,
      required: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    borrable: {
      type: boolean,
      default: true
    }
});

TipoEstablecimientoSchema.pre('validate', function(next) {    
    console.log(this);
    // if (this._id) {
    //   this._id = mongoose.Types.ObjectId(this._id)
    // }
    if(!this.fechaCreacion) {
        this.fechaCreacion =  moment(new Date()).format('YYYY-MM-DD')
    }
    next();
  });

module.exports = mongoose.model('TipoEstablecimiento', TipoEstablecimientoSchema, 'TipoEstablecimiento');
