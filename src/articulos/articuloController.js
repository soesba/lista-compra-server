'use strict';

const Articulo = require('./articuloModel');

module.exports.get = function(req, res) {
    Articulo.find()
    .then(c => res.jsonp(c))
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {    
    Articulo.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Articulo con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.delete = function(req, res) {
    Articulo.deleteOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'Articulo con id ' + req.params.id + ' no existe'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}