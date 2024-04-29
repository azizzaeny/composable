
var merge = (...args) => {
  let [obj1, obj2] = args;
  if(args.length === 1) return (obj1) => merge(obj1, obj2);
  return Object.assign({}, ...args);
}

var getIn =(...args) =>{
  let [coll, keys] = args;
  if(args.length === 2){
    return keys.reduce((acc, key) =>{
      if(acc && typeof acc === "object" && key in acc){
        return acc[key];
      }else{
        return undefined;
      }
    }, coll);
  }else{
    return (keysA) => getIn(coll, keysA);
  }
}

var assoc = (...args) =>{
  let [obj, key, val] = args;
  if (args.length === 3) {
    return { ...obj, [key]: val };
  } else if (args.length === 2) {
    return (val) => assoc(obj, key, val);
  }else{
    return (key, val) => assoc(obj, key, val);
  }
}

var assocIn = (...args) => {
  let [obj, keys, val] = args;
  if (args.length === 3) {
    keys = Array.isArray(keys) ? keys : [keys];
    const [firstKey, ...restKeys] = keys;
    const nestedValue = restKeys.length === 0 ? val : assocIn(obj[firstKey] || {}, restKeys, val);
    return assoc(obj, firstKey, nestedValue);
  } else if (args.length === 2) {
    return (val) => assocIn(obj, keys, val);
  } else if (args.length === 1) {
    return (keys, val) => assocIn(obj, keys, val);
  }
}

var responseWrite = (ctx, request, response) => {
  let alreadySent = request.sent;
  let dispatch = (ctx) => (
    response.writeHead(ctx.status, ctx.headers),
    response.write(ctx.body),
    response.end());  
  if(alreadySent) return dispatch(alreadySent);  
  return (ctx) ? dispatch(ctx) : (null);  
}

var isContentType = (request, type) => {
  let ctype = getIn(request, ['headers', 'content-type'])
  return ctype ? ctype.includes(type) : false;
}

var parseJSON = (request, response) => {
  try {
    (request.body = JSON.parse(request.body));
  }catch(err){
    console.log(err);
    (request.body = {});
    (request.sent = {status: 500, headers:{}, body: "Invalid JSON data:" + err })    
  }
};

var parseUrlencoded = (request, response) => (request.body = merge({}, require('querystring').parse(request.body)));   

var parseFormData = (request, response) => {
  let contentType = getIn(request, ['headers', 'content-type']);  
  let boundary = contentType.split('; ')[1].split('=')[1];
  let parts = request.body.split('--' + boundary);
  let params = parts.reduce((acc, section) =>{
    if (!section.includes('Content-Disposition')) return acc;    
    let [_, name] = section.match(/name="(.*)"/) || [];
    let filenameMatch = section.match(/filename="(.*)"/);
    if (filenameMatch) {
      let field = name.split(';')[0];
      let attr = field.substr(0, field.length -1);
      (acc[attr] = { "filename": filenameMatch[1] , "data": section.split('\r\n\r\n')[1] });
    }else{
      (acc[name] = section.split('\r\n\r\n')[1]);      
    }
    return acc;    
  }, {});
  (request.body = params);
}

var parseRequest = (request, buffer) => {
  (request.$parsed = require('url').parse(request.url, true));
  (request.query = request.$parsed.query);
  (request.path = request.$parsed.path);
  (request.body = Buffer.concat(buffer).toString());
  if(isContentType(request, 'application/json')) parseJSON(request, response);
  if(isContentType(request, 'application/x-www-form-urlencoded')) parseUrlencoded(request, response);
  if(isContentType(request, 'multipart/form-data')) parseFormData(request, response);
  return request;
};

var processRequest = (ctx) => (request, response) => {
  let buffer = [];
  request.on('data', chunk => buffer.push(chunk));
  request.on('end', _  => responseWrite(
    ctx.handler( parseRequest(request, buffer), response),
    request,
    response)) 
}

var createServer = (ctx, name="server") => merge(
  ctx,
  { [name] : require('http').createServer(processRequest(ctx)) }
);

var startServer = (ctx, name="server") => (
  getIn(ctx, [name, "listen"]) ? ( ctx[name].listen(ctx.port, ctx.onListen), ctx) : ctx
);

var stopServer = (ctx, name="server") => {
  return getIn(ctx, [name, "close"]) ? ( ctx[name].close(), (ctx[name] = null) ) : ctx;
}

var getServer = (ctx, name="server") => () => {
  return getIn(ctx, [name]);
}

var response = (body) => ({ status: 200, body, headers: {}})
var redirect = (url) => ({status: 302, headers: {"Location": url}, body: ""});
var created = (url) => ({ status: 201, headers: {"Location": url}, body: ""});
var badRequest = (body) => ({status: 400, headers: {}, body });
var notFound = (body) => ({ status: 404, headers:{}, body });
var status = (resp, code)  => assoc(resp, "status", status);
var header = (resp, header, value) => assocIn(resp, ["headers", header], value);
var headers = (resp, headers) => merge(resp, headers);
var contentType = (resp, type)=> headers(resp, {'Content-Type': type});

var cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'  
};

var clientRequest = clientRequest || [];

var responseBuffer = (request, response) => (clientRequest.push({request, response}), null);

var responseWith = (body) => (
  clientRequest.forEach(({response}) => responseWrite({status: 200, headers: cors, body }, response)),
  clientRequest = []
);


// TODO: find file automatic haders content-type mime-type and add content-length
// var findFile = (resp, file, headers) => ({ status: 200, headers: {}})

module.exports = {
  createServer,
  startServer,
  stopServer,
  getServer,
  response,
  redirect,
  created,
  badRequest,
  notFound,
  status,
  header,
  headers,
  contentType,
  cors,  
  isContentType,
  responseWrite,
  clientRequest,
  responseBuffer,
  responseWith
}
