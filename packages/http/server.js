var url  = require('url');

function log(tag, message) {
  return (data) => data ? console.log(tag, message, data) : console.log(tag, message);
}

function destoryServer(server){
  if(server && server.close) server.close();
  return (server = null);
}

function createServer(changeHandler, options){
  let {port, host} = options;
  let isHttps      = options.https || false;
  let certificate  = options.certificate;
  let isListen     = options.listen || true;
  let server;
  if(isHttps && certificate ){
    server = require('https').createServer(certificate); // {key, cert, ca}
  }else{
    server = require('http').createServer();    
  }
  server.on('request', requestHandler(changeHandler));
  if(isListen) server.listen(port, log('start', `listening at port ${port}`));
  return server;
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
  let matches = routes.find((route)=>{
    let parts  = route.match.split(' ');
    let method = parts[0];
    let path   = parts[1];    
    let rawExpression = path.replace(/\/:([\w-]+)/g, '/([$\\w-]+)').replace(/\//, '\/'); // capture params, in the end we replace everything /
    let expression    = new RegExp(`^${rawExpression}$`);        
    let resolve       = route.resolve;
    let requestPath   = (request.path.length > 1) ? request.path.replace(/\/$/,'') : request.path ; // so we dont have endup in tailing /
    // let params =  path.match(/\/:([\w-]+)/g) || [];
    // console.log(expression);
    // console.log(params);
    return (method === request.method && requestPath.match(expression));    
  });
  if(matches) return matches['resolve']; 
  return 'notFound';  
}

function isContentType(headers, type){
  return (headers['content-type'] === type);
}

function isObject(value) {
  return typeof value === 'object';
}

function responseRequest(responseObject, response){
  let {headers={}, body='', status=404} = responseObject;
  if(isContentType(headers, "application/json") || isObject(body)){ (body = JSON.stringify(body)); };
  response.writeHead(status, headers);  
  response.end(body);
}

function requestHandler(changeHandler){
  return function(request, response){
    let data = [];
    let pushBufferData =  (chunk)=> { if(request.method !== "GET" && chunk) (data.push(chunk)) }
    let responseData = async () => {
      // parse request
      (parseUrl(request), parseBody(request, data));      
      let {routes, resolve} = changeHandler(request);
      // routing
      let match   = matchRoutes(routes, request);
      let command = resolve[match]; 
      var object  = {status: 404, headers:{}, body: ''};        
      if(match && command) (object = await command(request, response));      
      responseRequest(object, response);
    }
    request.on('data', pushBufferData).on('end', responseData );
  }
}

module.exports = {  
  destoryServer, 
  createServer,
}
