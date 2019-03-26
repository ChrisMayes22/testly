const passport = require('../services/passport');
const mongoose = require('mongoose');
const express = require('express');
const router = new express.Router();


router.get('/google', passport.authenticate('google', { // Makes a request to Google for user's profile
  scope: ['profile', 'email'] //indicates what google should send back to us 
})) //User will be redirected to Google.

router.get('/google/callback', passport.authenticate('google'), (req, res, next) => { 
  console.log('logged in')
  console.log(req.session.passport);
  res.redirect('/');
});

module.exports = router;