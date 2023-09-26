var http = require('http');
var fs   = require('fs');
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

function handler(req, res){
  if(req.url === "/")
    return (res.writeHead(200, {"Content-Type": "text/html"}), res.end(blankCanvas));  
  if(req.url === "/connect")
    return request_poll.push(res);
  if(req.url === "/client.js") 
    return (res.writeHead(200, {"Content-Type": "application/javascript"}), res.end(clientJs));
  return res.end(`404 not found`);
}

function release(str){
  request_poll.forEach(client => client.end(str.toString()));
  request_poll = [];
  return;
}

function start(port){
  if(!port) (port=1356);
  if(process._SOCKET_HTTP) return console.log(`socket http server  already started at ${port}`);
  process._SOCKET_HTTP = http.createServer((req, res)=>{
    return handler(req, res);
  });
  process._SOCKET_HTTP.listen(port, ()=> console.log(`socket http server is running on ${port}`));
}

function stop(){
  if(process._SOCKET_HTTP && process._SOCKET_HTTP.close) return process._SOCKET_HTTP.close();
}

function evaluate(code){ return release(code); }

module.exports = {start, evaluate, stop}


