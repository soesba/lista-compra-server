'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
const transform = require('../utils/commonFunctions').transform;

var ModeloSchema = new Schema({
  nombre: {
    type: String,
    required: true
  }
});

// Duplicate the ID field.
ModeloSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

ModeloSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

ModeloSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

ModeloSchema.pre("validate", function (next) {
  if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (!this.fechaCreacion) {
   this.fechaCreacion = new Date();
  }
  next();
});

module.exports = mongoose.model('Modelo', ModeloSchema, 'Modelo');
