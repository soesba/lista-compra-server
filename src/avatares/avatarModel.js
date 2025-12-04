'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;
var ImageSchema = require('../common/imageSchema.js');

var AvatarSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  imagen: {
    type: ImageSchema,
    default: null,
  },
  fechaSubida: {
    type: Date,
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
  if (!this.fechaSubida) {
    this.fechaSubida = new Date();
  }
  next();
});

module.exports = mongoose.model('Avatar', AvatarSchema, 'Avatar');
