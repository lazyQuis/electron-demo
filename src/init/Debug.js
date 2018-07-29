"use strict";

const repl = require('repl');

const Me = class Debug {
  constructor() {
    this.server = false;
  }

  start(app) {
    var me = this;
    if (me.server !== false) {
      return;
    }
    console.log('debug start');
    me.server = repl.start();
    if (app.constructor.name !== 'App') {
      return;
    }
    me.server.on('exit', () => {
      app.quit();
    });
  }

  stop() {
    var me = this;
    if (me.server === false) {
      return;
    }
    me.server.close();
  }
};

module.exports = new Me;