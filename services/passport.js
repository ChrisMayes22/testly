/**
 * Passport Module
 * @module services/passport
 */

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_IDS } = require('../config/keys');
const userController = require('../controllers/user-controller');

const User = mongoose.model('User');

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
      done(null, user);
    }) // takes a session cookie from user and turns it into a user id.
})

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true,
    proxy: true
  },

  async (request, accessToken, refreshToken, profile, done) => {
    const user = await userController.create(profile);
    done(null, user);
  }
));


module.exports = passport;