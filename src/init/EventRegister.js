"use strict";

const {app, ipcMain} = require('electron')
    , path = require('path')
    , event = require('../event')
    , eventLint = require('../lib/EventListener');

const LOCAL_PATH = path.join(__dirname, '../event/');

const Me = class EventRegister{
  constructor() {
    this.event = event;
    this.listener = new eventLint(ipcMain, app, LOCAL_PATH);
  }

  init() {
    this.event.init(this.listener);
    this.event.regist();
  }
};

module.exports = new Me;