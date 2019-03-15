const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_IDS } = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
  done(null, user.id);
}) // puts user id into a session cookie that is sent to user. Session contents are encrypted.

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
      done(null, user);
    }) // takes a session cookie from user and turns it into a user id.
})


//Sets up Google OAuth
passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true
  },
  function(request, accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id})
      .then(existingUser => {
        if(existingUser) { //If this user already exists, then stop.
          done(null, existingUser);
        } else {
          if(ADMIN_IDS.find(char => char === profile.id)){ //Determine if user is going to be an admin, then add to db.
            new User({                                     //NOTE: Admin ids hard-coded ahead of time in /config/keys.js (gitignored) 
              googleId: profile.id,
              admin: true
            }).save().then(user => done(null, user));
          } else {
            new User({
              googleId: profile.id,
              admin: false
            }).save().then(user => done(null, user));
          }
        }
      })
  }
));


module.exports = passport;