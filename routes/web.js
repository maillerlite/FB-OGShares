const App = require(global.appRoot + '/app'),
  router = App.Express.Router();

if (process.env.SITE_PASSWORD) {
  router.post('/login', (req, res, next) => {
    if (process.env.SITE_PASSWORD === req.body.password) {
      res.cookie('password', req.body.password , {
        maxAge: 2628000000,
        httpOnly: true
      });
    }
    res.redirect(res.locals.url + '/login');
  });

  router.use((req, res, next) => {
    if (process.env.SITE_PASSWORD !== req.cookies.password) {
      res.clearCookie('password');
      if (req.originalUrl !== '/login') {
        res.redirect(res.locals.url + '/login');
        return;
      }
    }
    return next();
  });

  router.get('/login', (req, res, next) => {
    if (process.env.SITE_PASSWORD === req.cookies.password) {
      res.redirect(res.locals.url);
      return;
    }
    res.render('login', {
      pageTitle: 'Login'
    });
  });
}

router.get('/', (req, res, next) => {
  res.render('home', {
    pageTitle: 'Home'
  });
});

// catch 404 and forward to error handler
router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
router.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    pageTitle: err.message
  });
});

module.exports = router;