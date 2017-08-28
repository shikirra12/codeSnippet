const express = require('express');
const User = require('../models/user')
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/snippets');

const getUser = function(req, res, next) {
  User.find({}).sort('username')
  .then(function(users) {
    data = user
    next();
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
};

const loggedIn = function(req, res, next) {
  if(req.user){
    console.log(req.user);
    next();
  } else{
    redirect('/');
  }
};

router.get('/', function(req, res) {
  res.render('login');
});

// router.post('/login', function(req, res) {
//   res.redirect('profile');
// });

router.get('/signup', function(req, res) {
  res.render('signup');
});

router.post('/signup', function(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(function(data) {
    console.log(data);
    res.redirect('/');
  })
  .catch(function(err) {
    console.log(err);
    res.redirect('/signup')
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
