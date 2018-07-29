"use strict";

const BC = require('./controller');

const Me = class Browser{

  constructor() {
    //
  }

  init() {
    BC.init();
  }
}

module.exports = new Me;