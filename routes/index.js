var express = require('express');
var router = express.Router();
var app = require('../app');

/* GET home page. */
router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
  res.render('index', { username:  app.user.username});
});

router.post('/', function(req, res, next) {
  app.user.username=req.body.username;
  req.logout();
  res.redirect('/login');
});

module.exports = router;
