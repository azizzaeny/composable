
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

var fs = require('fs');

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
var status = (code, resp={body:'', headers:{}})  => assoc(resp, "status", status);
var header = (header, value, resp={status:200, body:''}) => assocIn(resp, ["headers", header], value);
var headers = (headers, resp={status:200, body:''}) => merge(resp, headers);
var contentType = (type, resp={status: 200, body:''})=> headers({'Content-Type': type}, resp);

var cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'  
};

var clientRequest = clientRequest || [];

var responseBuffer = (request, response) => (clientRequest.push({request, response}), null);

var responseWith = (body) => (
  clientRequest.forEach(({request, response}) => responseWrite({status: 200, headers: cors, body }, request, response)),
  clientRequest = []
);

var mimeType = (type) => {
  let mime =  {
    "7z"       : "application/x-7z-compressed",
    "aac"      : "audio/aac",
    "ai"       : "application/postscript",
    "appcache" : "text/cache-manifest",
    "asc"      : "text/plain",
    "atom"     : "application/atom+xml",
    "avi"      : "video/x-msvideo",
    "bin"      : "appation/octet-stream",
    "bmp"      : "im/bmp",
    "bz2"      : "apcation/x-bzip",
    "class"    : "lication/octet-stream",
    "cer"      : "apcation/pkix-cert",
    "crl"      : "apcation/pkix-crl",
    "crt"      : "application/x-x509-ca-cert",
    "css"      : "text/css",
    "csv"      : "text/csv",
    "deb"      : "application/x-deb",
    "dart"     :"application/dart",
    "dll"      :"application/octet-stream",
    "dmg"      :"application/octet-stream",
    "dms"      :"application/octet-stream",
    "doc"      :"application/msword",
    "dvi"      :"application/x-dvi",
    "edn"      :"application/edn",
    "eot"      :"application/vnd.ms-fontobject",
    "eps"      :"application/postscript",
    "etx"      :"text/x-setext",
    "exe"      :"application/octet-stream",
    "flv"      :"video/x-flv",
    "flac"     :"audio/flac",
    "gif"      :"image/gif",
    "gz"       :"application/gzip",
    "htm"      :"text/html",
    "html"     :"text/html",
    "ico"      :"image/x-icon",
    "iso"      :"application/x-iso9660-image",
    "jar"      :"application/java-archive",
    "jpe"      :"image/jpeg",
    "jpeg"     :"image/jpeg",
    "jpg"      :"image/jpeg",
    "js"       :"text/javascript",
    "json"     :"application/json",
    "lha"      :"application/octet-stream",
    "lzh"      :"application/octet-stream",    
    "mov"      :"video/quicktime",
    "m3u8"     :"application/x-mpegurl",
    "m4v"      :"video/mp4",
    "mjs"      :"text/javascript",
    "mp3"      :"audio/mpeg",
    "mp4"      :"video/mp4",
    "mpd"      :"application/dash+xml",
    "mpe"      :"video/mpeg",
    "mpeg"     :"video/mpeg",
    "mpg"      :"video/mpeg",
    "oga"      :"audio/ogg",
    "ogg"      :"audio/ogg",
    "ogv"      :"video/ogg",
    "pbm"      :"image/x-portable-bitmap",
    "pdf"      :"application/pdf",
    "pgm"      :"image/x-portable-graymap",
    "png"      :"image/png",
    "pnm"      :"image/x-portable-anymap",
    "ppm"      :"image/x-portable-pixmap",
    "ppt"      :"application/vnd.ms-powerpoint",
    "ps"       :"application/postscript",
    "qt"       :"video/quicktime",
    "rar"      :"application/x-rar-compressed",
    "ras"      :"image/x-cmu-raster",
    "rb"       :"text/plain",
    "rd"       :"text/plain",
    "rss"      :"application/rss+xml",
    "rtf"      :"application/rtf",
    "sgm"      :"text/sgml",
    "sgml"     :"text/sgml",
    "svg"      :"image/svg+xml",
    "swf"      :"application/x-shockwave-flash",
    "tar"      :"application/x-tar",
    "tif"      :"image/tiff",
    "tiff"     :"image/tiff",
    "ts"       :"video/mp2t",
    "ttf"      :"font/ttf",
    "txt"      :"text/plain",
    "wasm"     :"application/wasm",
    "webm"     :"video/webm",
    "webp"     :"image/webp",
    "wmv"      :"video/x-ms-wmv",
    "woff"     :"font/woff",
    "woff2"    :"font/woff2",
    "xbm"      :"image/x-xbitmap",
    "xls"      :"application/vnd.ms-excel",
    "xlsx"     :"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "xml"      :"text/xml",
    "xpm"      :"image/x-xpixmap",
    "xwd"      :"image/x-xwindowdump",
    "zip"      :"application/zip"
  }
  return mime[type];
};

var ext = (file) => require('path').extname(file).slice(1);

var isDirectory = (filePath) => fs.statSync(filePath).isDirectory();
var readFile = (file) => fs.readFileSync(file, 'utf8');

var findFile = (file, resp={status: 200, headers: {'Content-Type': mimeType(ext(file))} }) => {
  if(!isDirectory(file)) return merge(resp, {body: readFile(file) });
  let indexPath = require('path').join(filePath, 'index.html');
  return merge(resp, { body: readFile(indexPath) });
}

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
  responseWith,
  readFile,
  findFile,
  mimeType
}
