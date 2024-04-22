
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

/* implementation code*/

var responseWrite = (ctx, response) => (ctx) ? (
  response.writeHead(ctx.status, ctx.headers),
  response.write(ctx.body),
  response.end()
) : (null);

var createServer = (name, ctx) => merge(
  ctx,
  { [name] : require('http').createServer((request, response) => responseWrite(ctx.handler(request, response), response)) }
);

var startServer = (name, ctx) => (
  getIn(ctx, [name, "listen"]) ? ( ctx[name].listen(ctx.port, ctx.onListen), ctx) : ctx
);

var response = (body) => ({ status: 200, body, headers: {}})
var redirect = (url) => ({status: 302, headers: {"Location": url}, body: ""});
var created = (url) => ({ status: 201, headers: {"Location": url}, body: ""});
var badRequest = (body) => ({status: 400, headers: {}, body });
var notFound = (body) => ({ status: 404, headers:{}, body });
var status = (resp, code)  => assoc(resp, "status", status);
var header = (resp, header, value) => assocIn(resp, ["headers", header], value);
var headers = (resp, headers) => merge(resp, headers);
// TODO: find file automatic haders content-type mime-type and add content-length
// var findFile = (resp, file, headers) => ({ status: 200, headers: {}})

var http = {
  createServer,
  startServer,
  response,
  redirect,
  created,
  badRequest,
  notFound,
  status,
  header,
  headers
}
