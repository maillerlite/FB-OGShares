const Router = require('./Router');

class Routes {

  constructor(routePath) {
    this.routePath = routePath;
    this._list = [];
  }

  add(router) {
    try {
      this._list.push(new Router(this.routePath, router));
    }
    catch (error) {
      throw error;
    }
    return this;
  }

  getName(name) {
    return this._list.filter(router => {
      return router.name === name;
    });
  }

  each(callback) {
    this._list.forEach(val => {
      console.log(val);
    }, callback);
  }

}

module.exports = Routes;