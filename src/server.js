const path            = require('path');
const createError     = require('http-errors');
const express         = require('express');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const helmet          = require('helmet');
const mongoose        = require('mongoose');
const cookieSession   = require('cookie-session');
const passport        = require('passport');
const keys            = require('./config/keys');
                        require('./models/users');
                        require('./services/passport');

const app = express();
app.use(helmet());

mongoose.connect(keys.MONGO_URI) //connects to MongoDB. Note: requests sent from an IP address I have not white-listed will fail.
  .catch((err) => console.log(err));

// view engine setup, body parsers
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//CookieSession: Creates a cookie, stores a user id in the cookie (see /services/passport) via passport.session.user

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 100,
    keys: [keys.COOKIE_KEY]
  })
)
app.use(passport.initialize());
app.use(passport.session()); //NOTE: If your IP is not authorized to access my database, this will cause server to hang.
                             // To view site w/o database access, comment out this line.

require('./routes/authRoutes')(app); // Imports routes


// error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

module.exports = app;
