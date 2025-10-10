'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var ImageSchema = require('../common/imageSchema.js');

var AvatarSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  nombre: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  imagen: {
    type: ImageSchema,
    default: null,
  },
  fechaSubida: {
    type: String,
    required: true
  }
});

// Duplicate the ID field.
AvatarSchema.virtual('id').get(function(){
  return this._id.toHexString();
});

AvatarSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, result) => {
    return {
      ...result,
      id: result._id,
    }
  }
});

AvatarSchema.pre("validate", function (next) {
  if (!this._id) {
    this._id = new mongoose.Types.ObjectId();
  }
  if (!this.fechaCreacion) {
    this.fechaCreacion = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format();
  }
  next();
});

module.exports = mongoose.model('Avatar', AvatarSchema, 'Avatar');
