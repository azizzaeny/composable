var http = require('http');
var fs = require('fs');
var net = require('net');
var readline = require('readline');
var vm = require('vm');

var server ;
var request_poll = [];

var blankCanvas = `
<html><head></head><body><script src="client.js"></script></body></html>
`;

var clientJs = `
function poll_request(host){
  host = host || window.location.origin; 
  console.log('connecting...');
  return fetch(origin+'/connect').then(res => res.text())
         .then(res => (console.log('evaluate', res), eval(res), setTimeout(_=> poll_request(origin), 100)))
         .catch(err => (console.log(err), setTImeout(_ => poll_request(host), 100)))
}
window.onload = function(){ poll_request(); }
`;

function http_handler(req, res){
  if(req.url === "/")
    return (res.writeHead(200, {"Content-Type": "text/html"}), res.end(blankCanvas));  
  if(req.url === "/connect")
    return request_poll.push(res);
  if(req.url === "/client.js") 
    return (res.writeHead(200, {"Content-Type": "application/javascript"}), res.end(clientJs));
  return res.end(`404 not found`);
}

function http_release(str){
  request_poll.forEach(client => client.end(str.toString()));
  request_poll = [];
  return;
}

function http_start(port){
  if(!port) (port=1356);
  if(process._SOCKET_HTTP) return console.log(`socket http server  already started at ${port}`);
  process._SOCKET_HTTP = http.createServer((req, res)=>{
    return http_handler(req, res);
  });
  process._SOCKET_HTTP.listen(port, ()=> console.log(`socket http server is running on ${port}`));
}

function http_stop(){
  if(process._SOCKET_HTTP && process._SOCKET_HTTP.close) return process._SOCKET_HTTP.close();
}

function http_evaluate(code){ return http_release(code); }

var context;
var forceHttp;

function socket_release(line, socket){
  try{
    let msg = JSON.parse(line);
    if(msg && typeof msg.code === 'string'){
      let evaluator =  socket_evaluate;
      if(msg && msg.type === "node"){
        evaluator = socket_evaluate;
      }else if(msg && msg.type === "browser"){
        evaluator = http_evaluate;
      }else if(forceHttp){
        evaluator =  http_evaluate;
      }
      var res = evaluator(msg.code)
      socket.write(`${res}\n`);
    }else{
      socket.write(`Invalid msg format, ${line} \n`);
    }
  }catch(err){
    socket.write(`Error : ${err.message}\n`);
  }
}

function socket_evaluate(code){
  return vm.runInContext(code, context);  
}

function socket_start(port){
  if(!port) (port=1355);
  if(process._SOCKET) return console.log(`socket repl already start at ${port}`);
  context = vm.createContext(global);
  process._SOCKET = net.createServer(socket => {
    process._READLINE = readline.createInterface({
      input : socket,
      output: socket,
      prompt: ''
    });
    process._READLINE.on('line', line => socket_release(line, socket));
    socket.on('end', ()=> process._READLINE.close());
  });
  process._SOCKET.listen(port, ()=> console.log(`socket repl running on port ${port}`));
}

function socket_stop(){
  if( process._SOCKET && process._SOCKET.destroy ) process._SOCKET.destroy();
}

function start(socket_port, http_port){
  socket_start(socket_port);
  http_start(http_port);
  return true;
}

function stop(){
  http_stop();
  socket_stop();
  return true;
}

module.exports = {
  start, stop,
  socket_start, socket_stop,
  http_start, http_stop,
  http_evaluate, socket_evaluate
}
