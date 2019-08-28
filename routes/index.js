var express = require("express");
var router = express.Router();
var passport = require("../auth");

/* GET home page. */
router.get("/", require("connect-ensure-login").ensureLoggedIn(), function(
  req,
  res,
  next
) {
  res.render("index", { username: passport.getUsername() });
});

router.post("/", function(req, res, next) {
  passport.setUsername(req.body.username);
  req.logout();
  res.redirect("/login");
});

module.exports = router;
