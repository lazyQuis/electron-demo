"use strict";

const Me = class Event{

  constructor() {
    this.listener = false;
  }

  init(listener) {
    if(this.listener !== false || listener.constructor.name !== 'EventListener') {
      return;
    }
    this.listener = listener;
  }

  regist() {
    //regist ur event
    this.listener.regist('demo');
  }
}

module.exports = new Me;