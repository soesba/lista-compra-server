'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoUnidadEquivalenciaSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    from: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TipoUnidad",
      required: true
    },
    to: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "TipoUnidad",
      required: true
    },
    factor: {
      type: Number,
      default: '1',
      required: true
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
TipoUnidadEquivalenciaSchema.virtual('id').get(function(){
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
TipoUnidadEquivalenciaSchema.set('toJSON', {
  virtuals: true
});

TipoUnidadEquivalenciaSchema.pre('validate', function(next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId()
  }
  if(!this.fechaCreacion) {
      this.fechaCreacion =  new Intl.DateTimeFormat('es-ES', {day: '2-digit', month: '2-digit', year: 'numeric'}).format()
  }
  next();
});

TipoUnidadEquivalenciaSchema.pre("find", function (next) {
  this
  .populate("from", "_id nombre")
  .populate("to", "_id nombre")
  next();
})

TipoUnidadEquivalenciaSchema.pre("findOne", function (next) {
  this
  .populate("from", "_id nombre")
  .populate("to", "_id nombre")
  next();
})


module.exports = mongoose.model('TipoUnidadEquivalencia', TipoUnidadEquivalenciaSchema, 'TipoUnidadEquivalencia');
