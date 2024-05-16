'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var moment = require('moment');

var MiembroSchema = new Schema({
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
    }
});

MiembroSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    object.fechaCreacion = moment(this.created).format('DD/MM/YYYY');
    return object;
});

module.exports = mongoose.model('Miembro', MiembroSchema);
