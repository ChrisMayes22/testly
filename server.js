const path            = require('path');
      createError     = require('http-errors');
      express         = require('express');
      cookieParser    = require('cookie-parser');
      logger          = require('morgan');
      helmet          = require('helmet');
      cookieSession   = require('cookie-session');
      passport        = require('passport');
      mongoose        = require('./db/mongoose');
      User            = require('./models/users');
      keys            = require('./config/keys');
      authRouter      = require('./routers/authRoutes');
      apiRouter       = require('./routers/apiRoutes');
                        require('./models/users');
                        require('./services/passport');

const app = express();
app.use(helmet());



// view engine setup, body parsers

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

app.use('/auth', authRouter);
app.use('/api', apiRouter);

// error handlers
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(`err: ${err.message}`);
});

const PORT = process.env.PORT

console.log(`Express server listening at ${PORT}`)
app.listen(PORT);

module.exports = app;