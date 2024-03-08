// todo using npm here
var {isObject, reduce, replace, first, second, find, map, merge} = require('../clojure.core');

var url  = require('url');

var parseUrl = (request) => {
  (request.parsed = url.parse(request.url, true));
  (request.query = request.parsed.query);
  (request.path = request.parsed.pathname);
  return true;
}

var parseBody = (request, data)  => {
  (request.body = Buffer.concat(data).toString());
  if(request.headers && request.headers['content-type'] === "application/json"){
    (request.body = JSON.parse(request.body));
  };
  return true;
};

var findRoutes = (routes, request) =>{
  let matchRoute = find((route, index)=>{
    let {act, match, before, after} = route;
    let [method, path] = match.split(' ');
    let expr = replace(replace(path, /\/:([\w-]+)/g, '/([$\\w-]+)'), /\//, '\/');
    let newExpression  = new RegExp(`^${expr}$`);
    let normalizePath  = path => (path.length > 1) ? replace(path, /\/$/, '') : path;
    let requestPath    = normalizePath(request.path);
    let routeParameter = path.match(/\/:([\w-]+)/g) || [];
    let valueExpr      = requestPath.match(newExpression) || [];
    let isMatched      = valueExpr.length > 0;
    let params         = reduce((acc, value, index)=>{
      let key = replace(value, '/:', '');
      let val = valueExpr[index + 1];
      return merge(acc, {[key]: val});
    },{}, routeParameter);    
    route.paramsFounded = params;
    return (method === request.method && requestPath.match(newExpression));
  });
  let selected = matchRoute(routes);
  if(selected) return (request.params = selected['paramsFounded'], selected['act']);
  return 'default';
}

var isContentType = (headers, type) =>  (headers['content-type'] === type);

var responseWrite = (res, obj) => {
  let { headers={'Content-Type': 'text/plain'}, body='', status=500} = obj;
  if(isContentType(headers, "application/json") || isObject(body)){ (body = JSON.stringify(body)); };
  return (
    res.writeHead(status, headers),
    res.write(body),
    res.end(),
    true
  );
}

var routesHandler = handler => (request, response) => {
  let buffer = [];
  let collectBuffer = chunk => buffer.push(chunk);
  let responseRequest = async  () =>{
    (parseUrl(request), parseBody(request, buffer));    
    let resolveMap = await handler(request); // {routes, actions}
    let routesMap = resolveMap.routes;
    let actionsMap = resolveMap.actions;
    actionsMap = merge({ default: () => ({status: 404, headers: {}, body: ''}) }, actionsMap);
    let matchRoutes = findRoutes(routesMap, request);
    let actionToCall = actionsMap[matchRoutes];
    let responseObject = null;
    if(matchRoutes && actionToCall) (responseObject = await actionToCall(request, response));
    if(responseObject) responseWrite(response, responseObject);
  }
  let processRequest = map(({ onType, process})=> request.on(onType, process));  
  processRequest([
    { onType: 'data', process: collectBuffer },
    { onType: 'end', process: responseRequest }
  ]);
  return true;
}

var createServer = handler => {
  let options, server;
  if(isFn(handler)) (options = handler());
  let port = options.port;
  let type   = options.type || 'http';
  let cert   = options.cert;  
  if(type === "https" && ! cert) return 'require certificate';
  if(type === "http") (server = require('http').createServer());
  if(type === "https") (server = require('https').createServer(cert));
  if(!server) return 'unknown type or no routes';
  server.on('request', routesHandler(handler));
  server.$options =  {port};
  return server;
}

var startServer = server => {
  if(!server || !server.$options) return 'no server instnce';
  let port = server.$options.port;
  server.listen(port, _ => console.log('start listening on port', port));
  return server;
}

module.exports = {createServer, startServer};
