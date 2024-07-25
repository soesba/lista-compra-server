'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoEstablecimientoSchema = new Schema({
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
    },
    fechaCreacion: {
        type: String,
        required: true
    },
    borrable: {
      type: Boolean,
      default: true
    }
});

// Duplicate the ID field.
TipoEstablecimientoSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
TipoEstablecimientoSchema.set('toJSON', {
  virtuals: true
});

// Devolvemos objeto con nombre campo id amigable
// TipoEstablecimientoSchema.method("toJSON", function () {
//     const { __v, _id, ...object } = this.toObject();
//     object.id = _id;
//     return object;
// });


TipoEstablecimientoSchema.pre('validate', function(next) {    
    if (!this._id) {
      this._id = mongoose.Types.ObjectId()
    }
    if(!this.fechaCreacion) {
        this.fechaCreacion =  new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}).format()
    }
    next();
  });

module.exports = mongoose.model('TipoEstablecimiento', TipoEstablecimientoSchema, 'TipoEstablecimiento');
