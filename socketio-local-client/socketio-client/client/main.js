import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

import './main.html';

// Socket io client
socket = require('socket.io-client')(`https://<HEROKU-APP-NAME>.herokuapp.com`, {secure: true});
socket.on('connect', function() {
  console.log('Im connected');
  var id = socket.io.engine.id
  console.log(id)
});

// Fix for https://github.com/socketio/socket.io-client/issues/961
import Response from 'meteor-node-stubs/node_modules/http-browserify/lib/response';
if (!Response.prototype.setEncoding) {
  Response.prototype.setEncoding = function(encoding) {
    // do nothing
  }
}


Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
  Session.set('time', '--');
});

Tracker.autorun(() => {
  socket.on('time', function(timeString) {
    console.log(timeString);
    Session.set('time', timeString);
  });
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
  serverTime() {
    return Session.get('time');
  }
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
