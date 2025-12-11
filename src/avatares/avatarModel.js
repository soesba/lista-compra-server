'use strict';

const mongoose = require('mongoose');
const	Schema = mongoose.Schema;
const ImageSchema = require('../common/imageSchema.js');
const transform = require('../utils/commonFunctions').transform;

const AvatarSchema = new Schema({
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

AvatarSchema.virtual('id').set(function (val) {
  if (val == null || val === '') return;
  this._id = mongoose.Types.ObjectId.isValid(`${val}`) ? new mongoose.Types.ObjectId(`${val}`) : val;
});

AvatarSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform
});

AvatarSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform
});

AvatarSchema.pre("validate", function (next) {
   if (!this._id && this.id) {
    this._id = new mongoose.Types.ObjectId(`${this.id}`);
    delete this.id;
  }
  if (!this.fechaSubida) {
    this.fechaSubida = new Date();
  }
  next();
});

module.exports = mongoose.model('Avatar', AvatarSchema, 'Avatar');
