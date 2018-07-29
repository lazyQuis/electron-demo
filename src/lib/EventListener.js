"use strict";

const path = require('path')
    , url = require('url');

const Me = class EventListener {
  constructor(ipc, app, path) {
    if(ipc.constructor.name !== 'EventEmitter' || app.constructor.name !== 'App'){
      return;
    }
    console.log('ipc lint start');
    this._ipc = ipc;
    this._app = app;
    this._path = path || Me.LOCAL_PATH;
  }

  regist(name) {
    name = name || '';
    const me = this;
    if(typeof name !== 'string' || !name) {
      throw new Error('ipc event needs name');
      return false;
    }
    if (name in Me.REG_LIST) {
      throw new Error('ipc event duplicated : ' + name);
      return;
    }
    const pathName = me._path + name;
    const register = require(pathName);
    Me.REG_LIST[name] = new register();
    me._ipc.on(name, (event, type, ...data) => {
      let result = false;
      if (type && type in Me.REG_LIST[name]) {
        console.log(callback);
        Me.REG_LIST[name][type](...data);
        result = true;
      }
      event.returnValue = result;
    });
  }
};

Me.LOCAL_PATH = path.join(__dirname, 'event/');
Me.REG_LIST = {};

module.exports = Me;