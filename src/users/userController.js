'use strict';

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.authenticate = function(req, res) {    
    User.findOne({username: req.body.username, password: req.body.password})
        .then(u => {
            if (u) {
                res.jsonp(u);
            }else {                
                res.status(500).send({message: 'Username or password is incorrect'});
            }
        })
        .catch(error => res.status(500).send({message: error}));
}

module.exports.register = function(req, res) {
    var user = new User(req.body);

    User.findOne({username: user.username})
        .then(u => {
            if (u) {
                res.status(500).send({message: 'Username "' + user.username + '" is already taken'});
            }
        });

    user.save()
        .then(u => res.jsonp(u))
        .catch(error => res.status(500).send({message: error}));

}

module.exports.getAll = function(req, res) {
    User.find({})
        .then(u => {
            if (u) {
                res.jsonp(u);        
            }else {
                res.status(500).send({message: 'No users found'});
            }
        })
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.getById = function(req, res) {
    User.findOne({'_id': req.params.id})
        .then(u => {
            if (u) {
                res.jsonp(u);                
            }else {
                res.status(500).send({message: 'User with id ' + req.params.id + ' no exists'});
            }
        })
        .catch(error => res.status(500).send({message: error}));;
}

module.exports.updateFollowing = function(req, res) {
    var userId = req.params.id;
    var data = req.body.following;   
    
    User.updateOne({_id: userId},
        {$set: {following: data}})
        .then(u => res.jsonp(u))
        .catch(error => {
            return res.status(500).send({message: error})});

}

module.exports.update = function(req, res) {
    var userId = req.params.id;
    var data = req.body; 
    
    User.updateOne({_id: userId}, data)
        .then(u => res.jsonp(u))
        .catch(error => {
            return res.status(500).send({message: error})});

}

module.exports.delete = function(req, res) {
    var userId = req.params.id;
    
    User.findOneAndRemove({_id: userId})
        .then(u => res.jsonp(u))
        .catch(error => {
            return res.status(500).send({message: error})});

}