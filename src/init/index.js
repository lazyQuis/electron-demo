"use strict";

const { app } = require('electron')
    , debug = require('./Debug')
    , event = require('./EventRegister')
    , browser = require('./Browser');

const NODE_ENV = process.env.NODE_ENV;

let _isInit = false;

/**
 * init item
 */
//repl for debug
const debugInit = () => {
  if (NODE_ENV !== 'development') {
    return;
  }
  debug.start(app);
}

//model register
const modelInit = () => {
  model.init();
}

//app event register
const appInit = () => {
  app.on('ready', browser.init.bind(browser));
  app.on('window-all-closed', function () {
    app.quit()
  });
  app.on('will-quit', function () {
    console.log('quit app...');
    debug.stop();
  }); 
}

//ipc event register
const eventInit = () => {
  event.init();
}

//init
module.exports = () => {
  if(_isInit === true){
    return;
  }
  console.log('app init...');
  _isInit = true;
  eventInit();
  appInit();
  debugInit();
};