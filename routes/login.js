var express = require('express')
var router = express.Router()
var passport = require('../auth')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { message: req.flash('error') })
})
router.post(
  '/',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }),
  function (req, res, next) {
    res.redirect('/')
  }
)
module.exports = router
