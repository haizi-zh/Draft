var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User          = require('../models/user').User;

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(name, done) {
  User.findByName(name, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  console.log(password);
  User.findByName(username, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      console.log('用户名错误');
      return done(null, false, { message: 'Unknown user ' + username });
    }
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if(isMatch) {
        console.log('成功');
        return done(null, user);
      } else {
        console.log('密码错误');
        return done(null, false, { message: 'Invalid password' });
      }
    });
  });
}));


exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('登陆了');
    return next();
  }
  res.redirect('/')
}

exports.ensureAdmin = function ensureAdmin(req, res, next) {
  if(req.user && req.user.admin === true){
    console.log('管理员来了');
    next();
  }
  else{
    res.send(403);
  }
}