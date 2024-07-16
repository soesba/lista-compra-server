'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var EstablecimientoSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    nombre: {
        type: String,
        default: '',
        trim: true
    },
    fechaCreacion: {
        type: Date,
        required: true
    },
    borrable: {
      type: Boolean,
      default: true
    }
});

EstablecimientoSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.fechaCreacion = moment(this.created).format('DD/MM/YYYY');
    return object;
});

module.exports = mongoose.model('Establecimiento', EstablecimientoSchema);
