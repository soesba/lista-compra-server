'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transform = require('../utils/commonFunctions').transform;

const RolSchema = new Schema({
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

RolSchema.virtual('id').set(function(){
 if (val == null || val === '') return;
   this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

RolSchema.set('toJSON', {
   virtuals: true,
  versionKey: false,
  transform
});

RolSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

RolSchema.pre("validate", function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Rol', RolSchema, 'Rol');
