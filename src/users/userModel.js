'use strict';

var mongoose = require('mongoose');
var	Schema = mongoose.Schema;

var UserSchema = new Schema({
	nombre: {
		type: String,
		trim: true,
		default: ''
	},
	primerApellido: {
		type: String,
		trim: true,
		default: ''
	},
    segundoApellido: {
		type: String,
		trim: true,
		default: ''
	},
	email: {
		type: String,
		trim: true,
		default: ''
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: ''
	},
	fechaCreacion: {
		type: String,
		default: Date.now
	},
	ultimoAcceso: {
		type: String,
        required: true
	},
});

UserSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;	
	object.displayName = (`${this.firstName} ${this.lastName}`);
    return object;
});

mongoose.model('User', UserSchema);
