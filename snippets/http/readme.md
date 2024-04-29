Translate incomin http request into data strcuture like ring in clojure
### Files
- [util.js](./util.js)
- [repl-client.js](./repl-client.js)

### Usage
type `node`
then 

running it by

```js
var state = {};
var middleware = () => response('hello world');

var main = () => {
  state = startServer(
    createServer({
      port: 8081,      
      handler: (req, res) => middleware(req, res)
    })        
  );
  return state
}


```
the type `main()`
working with replClient 

```js



var indexHtml = `
<html>
 <head>
   <script src="client-repl.js"></script>
 </head>
 <body>test</body>
</html>
`;

var defaults = (request) => headers(response(indexHtml), {"Content-Type": "text/html"});

var clientRepl = (req, res) => ({
  status: 200,
  body: fs.readFileSync('./client-repl.js', 'utf8'),
  headers: merge(cors, {"Content-Type": 'application/javascript'})
});

var routes = {
  ["GET /"] : defaults,
  ["GET /_repl"]: responseBuffer,
  ["GET /client-repl.js"]: clientRepl
};

var middleware = (req, res) => {
  let resolve = routes[`${req.method} ${req.path}`];
  if(resolve) return resolve(req, res);
  return notFound('');
}

var state = {}

var main = () => {
  state = startServer(
    createServer({
      port: 8081,      
      handler: (req, res) => middleware(req, res)
    })        
  );
  return 'running at '+ state.port;
}

```

client repl

```js path=client-repl.js
esprima = window.esprima || {} ;
escodegen = window.escodegen || {};
howTo = () => console.log('usage: interactive client development with repl, first initiate dependencies and start pulling by typing  dev() at console');
assignVar = (global, name) => res => Object.assign(global, { [name]: (res.default) });
parseCode = (code, es5) => {
  if(es5){
    return esprima.parseScript(code, { range: true, tolerant: true});
  }else{
    return esprima.parseModule(code, { range: true, tolerant: true });
  }
}
generateCode = (ast) => {
  return escodegen.generate(ast);
}
nodeType = {
  'VariableDeclaration': (node)=>{
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": node.declarations[0].id,        
        "right": node.declarations[0].init,
        "range": []
      },
      "range": node.range
    }
  },
  'FunctionDeclaration': (node)=>{
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": node.id,        
        "right": {
          "type": "ArrowFunctionExpression",
          "id": null,
          "params": node.params,
          "body": node.body
        },
        "range": []
      },
      "range": node.range
    }
  }
}
traverse  = (acc, node, index) => {
  if(nodeType[node.type]){
    let transform = nodeType[node.type](node);
    return acc.concat(transform);
  }else{
    return acc.concat(node);
  }
}
transformCode = (ast) => {
  return {
    ...ast,
    body: ast.body.reduce(traverse, []).flat().filter(e=> e !== null),
    sourceType: "module",
    ecmaVersion: "latest"
  }
}
generateSafeCode = (code, context) => {
  return generateCode(transformCode(parseCode(code)));
}

evalJs = (res) => {
  try{
    let out = eval(generateSafeCode(res));
    if(out) console.log(out);
    return Promise.resolve('evaluate');
  } catch(e){
    return Promise.reject(e);
  }
}

requestPoll = (url) => fetch(url).then(res => res.text()).then(evalJs).catch(err => console.error(err)).finally((res) => (setTimeout(()=> requestPoll(url, 100), console.log(res)))) ;

dev = (hostUri) => {
  Promise.all([
    import('https://cdn.jsdelivr.net/npm/esprima@4.0.1/+esm').then(assignVar(window, "esprima")),
    import('https://cdn.jsdelivr.net/npm/escodegen@2.1.0/+esm').then(assignVar(window, "escodegen"))
  ]).then(() => requestPoll(hostUri));
  return 'evaluated';
}
```

then type `main()` to start the server, then at client side browser console, 
type `dev()` to start client or `howTo()` to getting more information  

to start sending changes to client, in the repl type `responseWith("console.log(100);");`


### TODO: implementation
```js

/*
  var mainHandler =(request, response) => ({ status: 200, headers:{}, body: 'hellow yo, whatsup'});
  var s = createServer("server", { port: 8080, message: "running", handler: (r,s)=> mainHandler(r,s) })
  startServer("server", s)
  request 
  request-url
  content-type
  content-length getIn request headers content-length
  urlencoded-form? "application/x-www-form-urlencoded"

  find-file-named isFile
  find-index-file check is it index.html exists
  find-file isDirectory -> exists file go to file, check index 
  file-data file
  {:content        file
  :content-length (.length file)
  :last-modified  (last-modified-date file)})

  (defn- content-length [resp len]
  (if len
  (header resp "Content-Length" len)
  resp))

  (defn- last-modified [resp last-mod]
  (if last-mod
  (header resp "Last-Modified" (format-date last-mod))
  resp))
  
  file-response 
  content-type
  find-header
  set-cookie 

  mimeType
  {"7z"       "application/x-7z-compressed"
  "aac"      "audio/aac"
  "ai"       "application/postscript"
  "appcache" "text/cache-manifest"
  "asc"      "text/plain"
  "atom"     "application/atom+xml"
  "avi"      "video/x-msvideo"
  "bin"      "application/octet-stream"
  "bmp"      "image/bmp"
  "bz2"      "application/x-bzip"
  "class"    "application/octet-stream"
  "cer"      "application/pkix-cert"
  "crl"      "application/pkix-crl"
  "crt"      "application/x-x509-ca-cert"
  "css"      "text/css"
  "csv"      "text/csv"
  "deb"      "application/x-deb"
  "dart"     "application/dart"
  "dll"      "application/octet-stream"
  "dmg"      "application/octet-stream"
  "dms"      "application/octet-stream"
  "doc"      "application/msword"
  "dvi"      "application/x-dvi"
  "edn"      "application/edn"
  "eot"      "application/vnd.ms-fontobject"
  "eps"      "application/postscript"
  "etx"      "text/x-setext"
  "exe"      "application/octet-stream"
  "flv"      "video/x-flv"
  "flac"     "audio/flac"
  "gif"      "image/gif"
  "gz"       "application/gzip"
  "htm"      "text/html"
  "html"     "text/html"
  "ico"      "image/x-icon"
  "iso"      "application/x-iso9660-image"
  "jar"      "application/java-archive"
  "jpe"      "image/jpeg"
  "jpeg"     "image/jpeg"
  "jpg"      "image/jpeg"
  "js"       "text/javascript"
  "json"     "application/json"
  "lha"      "application/octet-stream"
  "lzh"      "application/octet-stream"
  "mov"      "video/quicktime"
  "m3u8"     "application/x-mpegurl"
  "m4v"      "video/mp4"
  "mjs"      "text/javascript"
  "mp3"      "audio/mpeg"
  "mp4"      "video/mp4"
  "mpd"      "application/dash+xml"
  "mpe"      "video/mpeg"
  "mpeg"     "video/mpeg"
  "mpg"      "video/mpeg"
  "oga"      "audio/ogg"
  "ogg"      "audio/ogg"
  "ogv"      "video/ogg"
  "pbm"      "image/x-portable-bitmap"
  "pdf"      "application/pdf"
  "pgm"      "image/x-portable-graymap"
  "png"      "image/png"
  "pnm"      "image/x-portable-anymap"
  "ppm"      "image/x-portable-pixmap"
  "ppt"      "application/vnd.ms-powerpoint"
  "ps"       "application/postscript"
  "qt"       "video/quicktime"
  "rar"      "application/x-rar-compressed"
  "ras"      "image/x-cmu-raster"
  "rb"       "text/plain"
  "rd"       "text/plain"
  "rss"      "application/rss+xml"
  "rtf"      "application/rtf"
  "sgm"      "text/sgml"
  "sgml"     "text/sgml"
  "svg"      "image/svg+xml"
  "swf"      "application/x-shockwave-flash"
  "tar"      "application/x-tar"
  "tif"      "image/tiff"
  "tiff"     "image/tiff"
  "ts"       "video/mp2t"
  "ttf"      "font/ttf"
  "txt"      "text/plain"
  "wasm"     "application/wasm"
  "webm"     "video/webm"
  "webp"     "image/webp"
  "wmv"      "video/x-ms-wmv"
  "woff"     "font/woff"
  "woff2"    "font/woff2"
  "xbm"      "image/x-xbitmap"
  "xls"      "application/vnd.ms-excel"
  "xlsx"     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  "xml"      "text/xml"
  "xpm"      "image/x-xpixmap"
  "xwd"      "image/x-xwindowdump"
  "zip"      "application/zip"}
  
  filename-ext
  ext-mime-type filename

*/
```
