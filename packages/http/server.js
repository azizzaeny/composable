var http = require('http');
var url  = require('url');

var server;


function log(tag, message) {
  return (data) => data ? console.log(tag, message, data) : console.log(tag, message);
}

function getServer(){
  return server;
}

function resetServer(){
  if(server && server.close) server.close();
  return (server=null);
}

function createServer(changeHandler, port=8080){
  if(server) return 'already created server';
  server = http.createServer();
  server.on('request', requestHandler(changeHandler));
  server.listen(port, log('start', `listening at port ${port}`));
}

function parseUrl(request){  
  (request.parsed = url.parse(request.url, true));
  (request.query = request.parsed.query);
  (request.path = request.parsed.pathname);
  return true;
}

function parseBody(request, data){
  (request.body = Buffer.concat(data).toString());
  if(request.headers && request.headers['content-type'] === "application/json"){
    request.body = JSON.parse(request.body);
  };
  return true;
}

function matchRoutes(routes, request){
  let match = routes.find((route)=>(route.method === request.method && route.path === request.path)) || {action: "notFound"};
  return match;
}

function requestHandler(changeHandler){
  return function(request, response){
    let data = [];
    request
      .on('data', (chunk)=> { if(request.method !== "GET" && chunk) (data.push(chunk))})
      .on('end', async () => {
        parseUrl(request);
        parseBody(request, data);
        let {routes, actions} = changeHandler(request);
        let match = matchRoutes(routes, request);
        let command = actions[match['action']];
        var object = {status: 404, headers:{}, body: 'not-found'};        
        if(match && command) (object = await command(request, response));  
        let {headers={}, body='', status=404} = object;
        response.writeHead(status, headers);
        response.end(body);      
      });
  }
}

module.exports = {
  getServer,
  resetServer, 
  createServer,
  log,
}
