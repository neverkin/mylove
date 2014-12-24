var User = require('../../models/userModel');
var message_login;
var message_reg;

module.exports = function(app) {
  app.get('/login', function(req, res) {
  	res.render('login/login', {
  	  title: 'login',
      message_login: message_login
  	})
  })

  app.post('/login', function(req, res) {
    var user = req.body.user;
    var username = user.username;
    var password = user.password;
    User.findOne({'username': username}, function(err, user) {;
      if(err) {
        console.log(err);
      }
      if(!user) {
        message_login = 'sorry,username is wrong';
        return res.redirect('/login');
      }
      user.comparePassword(password, function(err, isMatch) {
        if(err) {
          console.log(err);
        }
        if(isMatch) {
          req.session.user = user;
          message_login = null;
          return res.redirect('/');
        } else {
          message_login = 'sorry,passowrd is wrong'
          res.redirect('/login');
        }
      })
    })
  })

  app.get('/reg', function(req, res) {
  	res.render('login/reg', {
  	  title: 'reg',
      message_reg: message_reg
  	})
  })

  app.post('/reg', function(req, res) {
    var newUser = new User(req.body.user);
    if(req.body.user['password'] != req.body.user['repeat-password']) {
      message_reg = 'password is different';
      return res.redirect('/reg');
    }
    User.find({$or:[{'username': req.body.user['username']},{'email': req.body.user['email']}]}, function(err, docs) {
      if(docs.length != 0) {
        err = 'Username or email already exists';
      }
      if(err) {
        console.log(err);
        message_reg = err;
        return res.redirect('/reg');
      }
      newUser.save(function(err) {
        if(err) {
          message_reg = 'failed';
          return res.redirect('/reg');
        }
        res.redirect('/login');
      })
    })
  })

  app.get('/logout', function(req, res) {
    req.session.user = null;
    res.redirect('/');
  })
}