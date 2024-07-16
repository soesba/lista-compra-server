'use strict';

var mongoose = require('mongoose');
const TipoUnidad = require('./tipoUnidadModel');

module.exports.get = function(req, res) {
    TipoUnidad.find()
    .then(c => res.jsonp(c))
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {    
    TipoUnidad.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'TipoUnidad con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.getByAny = function(req, res) {
    const texto = new RegExp(req.params.texto)
    TipoUnidad.find({ $or: [
            { $text: {$search: req.params.texto } },
            { 'nombre': { $regex: texto, $options: 'i' } }, 
            { 'abreviatura':  { $regex: texto, $options: 'i' } }
        ]}).then(u => {
        if (u) {
            res.jsonp(u);                
        }else {
            res.status(500).send({message: 'TipoUnidad con algún campo ' + req.params.texto + ' no existe'});
        }
    }).catch(error => res.status(500).send({message: error}));
}

module.exports.delete = function(req, res) {
    TipoUnidad.deleteOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'TipoUnidad con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}