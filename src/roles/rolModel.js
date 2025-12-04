'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  nombre: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: false
  },
  fechaCreacion: {
    type: Date,
    required: true
  }
});

// Duplicate the ID field.
RolSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

RolSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});

RolSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Rol', RolSchema, 'Rol');
