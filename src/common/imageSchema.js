
var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ImagenSchema = new Schema({
  type: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
});

module.exports =  mongoose.Schema(ImagenSchema);