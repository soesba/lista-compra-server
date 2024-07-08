'use strict';

var mongoose = require('mongoose');
const TipoEstablecimiento = require('./tipoEstablecimientoModel');

module.exports.get = function(req, res) {
    TipoEstablecimiento.find()
    .then(c => res.jsonp(c))
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {    
    TipoEstablecimiento.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'TipoEstablecimiento con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.delete = function(req, res) {
    TipoEstablecimiento.deleteOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'TipoEstablecimiento con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}