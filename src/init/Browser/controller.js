"use strict";

const {BrowserWindow, globalShortcut} = require('electron')
    , url = require('url')
    , cfg = require('../../config');

const winObj = '_cdObj';

const Me = class BrowserController{

  constructor() {
    this.mainWindow = false;
    this.child = {};
  }

  _childSet(name, extObj, reset) {
    reset = reset || false;
    const me = this;
    if (name in me.child) {
      if (reset) {
        this.child[name].close();
      } else {
        return this.child[name];
      }
    }
    const info = me.infoGet(name);
    if(typeof extObj === 'object') {
      for(let prop of Me.ALLOW_LIST) {
        if(prop in extObj && extObj[prop]) {
          info[prop] = extObj[prop];
        }
      }
    }

    info.parent = me.mainWindow;
    me.child[name] = new BrowserWindow(info);
    if(typeof extObj === 'object' && typeof extObj.didFinishLoad === 'function') {
      me.child[name].webContents.on('did-finish-load', extObj.didFinishLoad);
    }
    me.child[name].on('close', () => {
      delete me.child[name];
    })
    return me.child[name];
  }

  _childGet(name) {
    const me = this;
    if (name && name in me.child) {
      return this.child[name];
    }
    return false;
  }

  init() {
    const me = this;
    if (me.mainWindow !== false) {
      return;
    }
    cfg.window.icon = process.env.WV_ICON;
    const enableDev = (process.env.NODE_ENV === 'production')?false:true;
    if (process.env.NODE_ENV === 'development') {
      require('devtron').install();
    }
    me.mainWindow = new BrowserWindow(cfg.window);
    let filePath = url.format({
      pathname: Me.WWW_INDEX,
      protocol: 'file:',
      slashes: true
    });
    me.mainWindow.loadURL(filePath);
    me.mainWindow.on('close', function () {
      me.mainWindow = null
    });
    globalShortcut.register('F12', () => {
      if (!enableDev) {
        return false;
      }
      let win = BrowserWindow.getFocusedWindow();
      if (win) {
        win.webContents.toggleDevTools({detach: true});
      }
    });
  }

  show(name) {
    name = name || '';
    const me = this;
    if(!name) {
      me.mainWindow.show();
      return;
    }
    const child = me._childGet(name);
    if(child) {
      child.show();
    }
  }

  openRootUrl(file, others, name, extObj, reset) {
    file = file || '';
    others = others || '';
    name = name || '';
    const me = this;
    if (!file || !name) {
      return;
    }
    let filePath = url.format({
      pathname: Me.WWW_PATH + file,
      protocol: 'file:',
      slashes: true
    });
    let rUrl = filePath + others;
    me.openUrl(rUrl, name, extObj);
  }

  openUrl(rUrl, name, extObj, reset) {
    rUrl = rUrl || '';
    name = name || '';
    const me = this;
    if (!rUrl || !name || me.mainWindow === false) {
      return;
    }
    let child = me._childSet(name, extObj, reset);
    child.loadURL(rUrl);
    child.show();
  }

  openGoogleViewer(rUrl, file, user) {
    const me = this;
    const name = 'googleViewerDemo';
    file = me.slasher(file);
    user = me.slasher(user);
    let obj = {
      width: 600,
      height: 800,
      webPreferences: {
        webSecurity:false
      },
      didFinishLoad: () => {
        let w = me.child[name].webContents;
        let jsFileCF = url.format({
          pathname: Me.FILE_LIST.js.cloudFile,
          protocol: 'file:',
          slashes: true
        });
        let cssFileCF = url.format({
          pathname: Me.FILE_LIST.css.cloudFile,
          protocol: 'file:',
          slashes: true
        });
        w.executeJavaScript(Me.FUNC_REGISTER.init);
        w.executeJavaScript(Me.FUNC_REGISTER.cssLoad);
        w.executeJavaScript(Me.FUNC_REGISTER.jsLoad);
        w.executeJavaScript(winObj + '.cssLoad(\'' + cssFileCF +  '\')');
        w.executeJavaScript(winObj + '.jsLoad(\'' + jsFileCF +  '\', () => {_cdObj.cf.resetGoogle(\''+ file +'\', \'' + user + '\')})');
      }
    }
    me.openUrl(rUrl, name, obj, true);
  }

  infoGet(name) {
    let info = Object.assign({}, cfg.window, Me.TYPE[name]);
    return info;
  }

  slasher(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  }
}


Me.WWW_PATH = process.env.WV_PATH + 'www/';
Me.WWW_INDEX = Me.WWW_PATH + 'index.html';

Me.ALLOW_LIST = ['width', 'height', 'title', 'resizable', 'webPreferences'];

Me.TYPE = {
  'test1': {
    title: 'Test 1',
    resizable: true,
    width:432, 
    height:720
  },
};

Me.FILE_LIST = {
  css: {
    cloudFile: Me.WWW_PATH + 'assets/css/external/demo.css'
  },
  js: {
    cloudFile: Me.WWW_PATH + 'assets/js/external/demo.js'
  }
}

Me.FUNC_REGISTER = {
  init: winObj + " = {}",
  cssLoad: winObj + ".cssLoad = (url) => {var link = document.createElement('link'); link.type = 'text/css'; link.rel = 'stylesheet'; link.href = url; document.head.appendChild(link);}",
  jsLoad: winObj + ".jsLoad = (url, callback) => {var script = document.createElement('script'); script.type = 'text/javascript'; script.src = url; script.onreadystatechange = script.onload = callback; document.head.appendChild(script);}"
}

module.exports = new Me;