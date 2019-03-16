const passport = require('../services/passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    console.log('SESSION', req.session);
    if(!req.session.passport){ //if user is not logged in, render the base page.'
        res.render('index');
    } else {
      const targetUser = req.session.passport.user;
      User.findById(targetUser) // Uses session id to find the user in the database
        .then(user => {
          if(user){
            res.render(user.admin ? 'admin' : 'user');  // Uses user's authorization level to render correct page.
          } else {
            res.render('index'); // If user is not found (ex if an invalid session is being used), render base page.
          }
        }).catch(err => {
          console.log('GOOGLE/CALLBACK ERR: ', err);
        })
    }
  })

  app.get('/auth/google', passport.authenticate('google', { // Makes a request to Google for user's profile
    scope: ['profile', 'email'] //indicates what google should send back to us 
  })) //User will be redirected to Google.
  
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => { // For future use, currently does nothing.
    res.redirect('/');
  });

  app.get('/api/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  })
}
