var express             = require('express'),
    router              = express.Router(),
    passport            = require("passport"),
    LocalStrategy       = require('passport-local').Strategy,
    User                = require('../models/user').User,
    pass                = require('../auth/pass');


/* GET home page. */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/switch',
    failureRedirect: '/',
    //failureFlash: true
  })
);

router.get('/',function(req, res) {
  res.render('index');
})

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


router.get('/switch', pass.ensureAuthenticated, function(req, res) {
  res.render('switch', {
    user: req.user
  });
});

router.get('/admin', pass.ensureAuthenticated, pass.ensureAdmin, function(req, res){
  res.render('admin', {
    user: req.user
  })
});

router.post('/addmenber', function(req, res){
  var username = req.body.username,
      password = req.body.password;
  console.log(username);
  console.log(password);
  if(username == '' || password == ''){
    console.log('err');
    res.redirect('/switch');
  }
  var user = new User({
    username  : username,
    password  : password,
    admin     :  false
  });
  user.save(function(err){
    if(err){
      res.redirect('/switch');
    }
    res.redirect('/admin');
  });
});


module.exports = router;