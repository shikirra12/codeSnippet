const express = require('express');
const User = require('../models/user');
const Snippet = require('../models/snippet');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

mongoose.connect('mongodb://localhost:27017/codesnippet');


const getUsers = function(req, res, next) {
  User.find({}).sort('username')
  .then(function(users) {
    req.users = users;
    next();
  })
  .catch(function(err) {
    console.log(err);
    next(err);
  });
};

const getSnippets = function(req, res, next) {
  Snippet.find({}).sort('title')
  .then(function(snippets) {
    req.snippets = snippets;
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

const login = function(req, res, next) {
  if (req.user) {
    res.redirect('profile')
  } else {
    next();
  }
};

router.get('/', function(req, res) {
  res.render('login');
});

router.post('/', login, passport.authenticate('local', {
  successRedirect: 'profile',
  failureRedirect: '/',
  failureFlash: true
}))

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

router.get('/index', loggedIn, getUsers, getSnippets, function(req, res) {
  for (var i = 0; i < req.snippets.length; i++) {
    if (req.snippets[i].username === req.user.username) {
      req.snippets[i].user = true;
    }
  }
  res.render('index', {snippets: req.snippets});
});

router.get('/profile', loggedIn, getUsers, function(req, res) {
  Snippet.find({username: req.user.username})
  .then(function(snippets) {
    // console.log('SNIPPET',snippets);
    // loggedUser = req.user
    // console.log(user.data, "Logged the user");
    res.render('profile', {user: req.user.id, username: req.user.username, snippet: snippets});
  })
});

router.post('/profile', loggedIn, function(req, res) {
  let tags = req.body.tags;
  console.log('TAGS',tags);
  let indivTags;
  indivTags = tags.split(' ');

  Snippet.create({
    username: req.user.username,
    title: req.body.title,
    body: req.body.body,
    notes: req.body.notes,
    language: req.body.language,
    tags: indivTags
  })
  .then(function(data) {
    res.redirect('/profile');
  })
});

let tempSnippet;

router.get('/edit/:id', function(req, res) {
  if (req.params.id === 'main.css') {
    res.render('edit', {snippet: tempSnippet});
    tempSnippet = null;
  } else {
  Snippet.findById(req.params.id)
  .then(function(snippet) {
    tempSnippet = snippet;
    res.render('edit', {snippet: snippet});
  })
  }
});

router.post('/edit/:id', function(req, res) {
  Snippet.update({
    username: req.user.username,
    title: req.body.title,
    body: req.body.body,
    notes: req.body.notes,
    language: req.body.language,
    tags: req.body.tags
  }
  , {id: req.params.id}
)
  .then(function (data) {
    Snippet.findOne({id: req.snippet})
      .then(function(snippet) {
        res.redirect('/profile')
      })
  })
});

router.get('/delete', getUsers, getSnippets, function(req, res) {
  Snippet.deleteOne({id: req.snippet})
  .then(function(snippet) {
    res.redirect('/profile');
  })
});

router.get('/tags/:tags', function(req, res) {
  Snippet.find({tag: req.body.tags})
  .then(function(snippet) {
    res.render('tags', {snippet: snippet, username: req.user.username});
  })
});

router.get('/single/:id', function(req, res) {
  if (req.params.id === 'main.css') {
    res.render('single', {snippet: tempSnippet});
    tempSnippet = 'null';
  } else {
  Snippet.findOne({id: req.snippet})
  .then(function(snippet) {
    res.render('single', {snippet: snippet, username: req.user.username})
  })
  }
});

router.get('/language/:language', function(req, res) {
  if (req.params.id == 'main.css') {
    res.render('language', { snippet: tempSnippet});
    tempSnippet = 'null';
  } else {
  Snippet.find({language: req.params.language})
  .then(function(snippet) {
    res.render('tags', {snippet: snippet, username: req.user.username});
  })
  }
});


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
