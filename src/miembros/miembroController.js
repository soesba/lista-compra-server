'use strict';

var mongoose = require('mongoose');
const Miembro = require('./miembroModel');

module.exports.get = function(req, res) {
    Miembro.find()
    .then(c => res.jsonp(c))
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {    
    Miembro.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Miembro con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.delete = function(req, res) {
    Miembro.deleteOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Miembro con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}