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
        required: true
    },
    abreviatura: {
      type: String,
      default: '',
      trim: true,
      required: true
    // },
    // fechaCreacion: {
    //     type: Date,
    //     required: true
    }
});

TipoUnidadSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.fechaCreacion = moment(this.created).format('DD/MM/YYYY');
    return object;
});

module.exports = mongoose.model('TipoUnidad', TipoUnidadSchema, 'TipoUnidad');
