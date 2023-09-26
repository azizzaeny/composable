var socket = require('./socket');
var http = require('./socket');

function start(){
  socket.start();
  http.start();
}

function stop(){
  socket.stop();
  http.stop();
}

module.exports = { socket, http, start, stop }
