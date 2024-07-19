'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EstablecimientoSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    tipoEstablecimiento: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "TipoEstablecimiento"
    },
    nombre: {
        type: String,
        default: '',
        trim: true,
        index: true
    },
    notas: {
        type: String,
        default: '',
        trim: true,
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

// Devolvemos objeto con nombre campo id amigable
EstablecimientoSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

EstablecimientoSchema.pre('validate', function(next) {    
    console.log(this);
    if (!this._id) {
      this._id = mongoose.Types.ObjectId()
    }
    if (this.tipoEstablecimiento) {
        this.tipoEstablecimiento = mongoose.Types.ObjectId(this.tipoEstablecimiento)
      }
    if(!this.fechaCreacion) {
        this.fechaCreacion =  new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}).format()
    }
    next();
  });
  
module.exports = mongoose.model('Establecimiento', EstablecimientoSchema, 'Establecimiento');
