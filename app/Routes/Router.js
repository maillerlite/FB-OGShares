class Router {

  constructor(routePath, options) {
    if (!options.router) {
      throw new Error('router can\'t empty');
    }

    if (!options.router instanceof Function) {
      throw new Error('router must function');
    }

    try {
      this.name = options.name;
      this.path = options.path;
      this.router = require(routePath + '/' + options.router);
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('File name `' + options.router + '` not found in `' + routePath + '`');
      }
      throw error;
    }

  }

}

module.exports = Router;