module.exports = passport = require("passport");
var Strategy = require("passport-local").Strategy;

var user = {
  username: "user",
  validPassword: function(passwd) {
    return passwd === "password";
  }
};
module.exports.setUsername = _username => {
  user.username = _username;
};
module.exports.getUsername = () => {
  return user.username;
};
var getUser = function(username, cb) {
  if (username !== user.username) return cb(null, null);
  cb(null, user);
};

passport.serializeUser(function(user, cb) {
  cb(null, user.username);
});

passport.deserializeUser(function(username, cb) {
  cb(null, user);
});

passport.use(
  "local-login",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    function(email, password, done) {
      getUser(email, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { message: "Wrong login." });
        if (!user.validPassword(password))
          return done(null, false, { message: "Wrong password." });
        return done(null, user);
      });
    }
  )
);
