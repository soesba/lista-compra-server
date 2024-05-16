'use strict';

var mongoose = require('mongoose');
const Establecimiento = require('./establecimientoModel');

module.exports.get = function(req, res) {
    Establecimiento.find()
    .then(c => res.jsonp(c))
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {    
    Establecimiento.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Establecimiento con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.delete = function(req, res) {
    Establecimiento.deleteOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Establecimiento con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}