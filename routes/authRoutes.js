const passport = require('../services/passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('index')
  })

  app.get('/auth/google', passport.authenticate('google', { // Makes a request to Google for user's profile
    scope: ['profile', 'email'] //indicates what google should send back to us 
  })) //User will be redirected to Google.
  
  app.get('/auth/google/callback', passport.authenticate('google'), (req, res, next) => {
    const targetUser = req.session.passport.user;
    User.findById(targetUser) // Uses session id to find the user in the database
      .then(user => {
        res.render(user.admin ? 'admin' : 'user');  // Uses user's authorization level to render correct page.
      }).catch(err => {
        console.log('GOOGLE/CALLBACK ERR: ', err);
      })
  });

  app.get('/api/current_user', (req, res, next) => {
    res.json(req.user); // For testing purposes. Will only render if user is logged in.
  })

  app.get('/api/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
  })
}
