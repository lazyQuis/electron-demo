"use strict";
//let version = process.versions;

const { app } = require('electron')
    , path = require('path')
    , pkgCfg = require('../package.json');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.WV_PATH = path.join(__dirname, '../assets/').replace(/\\/g, '/');
process.env.WV_ICON = (process.platform === 'darwin')?'':process.env.WV_PATH + '/assets/img/icon.png';

//for windows app
app.setAppUserModelId(pkgCfg.appId);

const init = require('./init');

const Me = class Main{
  constructor() {
    init();
  }
};

module.exports = Me;