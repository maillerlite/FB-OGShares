const App = require('./app'),
  app = new App(),
  path = require('path'),
  morgan = require('morgan'),
  helmet = require('helmet'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  favicon = require('serve-favicon');

let cookie = null;

if ('production' === process.env.NODE_ENV) { //development
  const secret = process.env.SITE_KEY;
  if (!secret || secret && !secret.trim().length) {
    throw new Error('Please set APP_KEY in your environment to secure your site in production');
  }
}

if (process.env.SITE_KEY) {
  app.express.set('trust proxy', 1);
  cookie = cookieParser(process.env.SITE_KEY);
}

if ('production' !== process.env.NODE_ENV) {
  app.express.use(morgan('dev'));

  if (null === cookie) {
    cookie = cookieParser();
  }
}
else {
  app.express.use(morgan('combined', {
    skip: (req, res) => { return res.statusCode < 400 }
  }));
}

app.express.use(favicon(path.join(global.appRoot, 'public', 'favicon.ico')));
app.express.use(App.Express.static(path.join(global.appRoot, 'public')));
app.express.use(helmet());
app.express.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.express.use(bodyParser.urlencoded({
  extended: true
}));
app.express.use(bodyParser.json());
app.express.use(cookie);

app.routes.add({
  'name': 'web',
  'path': '/',
  'router': 'web'
});

app.runRoute();

module.exports = app;