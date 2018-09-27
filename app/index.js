const path = require('path'),
  Express = require('express'),
  Routes = require('./Routes'),
  pjson = require('../package.json');

if (!global.appRoot) {
  global.appRoot = path.resolve(__dirname, '../');
}

class App {

  constructor(options) {
    options = options instanceof Object ? options : new Object({});
    const routes = options.routes,
      routePath = path.resolve(__dirname, '../routes');

    this.routes = new Routes(routePath, routes);
    this.express = Express();
    this.version = pjson.version;

    this.express.use((req, res, next) => {
      res.locals.url = req.headers['x-forwarded-proto'] + '://' + req.get('host');
      res.locals.siteName = process.env.siteName || process.env.SITE_NAME || 'Name';
      res.locals.siteTitle = process.env.siteTitle || process.env.SITE_TITLE || 'Title';
      res.locals.siteSlogan = process.env.siteSlogan || process.env.SITE_SLOGAN || 'Description';
      res.locals.siteFooter = process.env.SITE_FOOTER || 'yes';
      res.locals.pjson = pjson;

      try {
        const apps = require(global.appRoot + '/post-app.json');
        res.locals.apps = apps;
      } catch (error) {
        if (error instanceof Error && error.code === 'MODULE_NOT_FOUND') {
          next(new Error('missing file app.json!'));
        }
        else {
          next(error);
        }
        return;
      }

      next();
    });

    this.express.enabled('trust proxy');
    this.express.set('views', path.join(global.appRoot, 'resources/views'));
    this.express.set('view engine', 'pug');
  }

  runRoute(routes) {
    if (!routes) {
      routes = this.routes;
    }

    let i = 0;
    const list = routes._list;

    for ( ; i < list.length; i++ ) {
      this.express.use(list[i].path, list[i].router);
    }

    return this;
  }

}

App.Express = Express;
App.pjson = pjson;

module.exports = App;