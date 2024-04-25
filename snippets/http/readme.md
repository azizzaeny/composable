Translate incomin http request into data strcuture like ring in clojure
### Files
- [util.js](./util.js)
- [repl-client.js](./repl-client.js)

### Usage
type `node`
then 

```js

var evalCode= (...args) => {
  let [vm=require('vm'), ctx=global, addCtx={console, require, module}] = args;
  return (res) => {
    let context = vm.createContext(ctx);
    return vm.runInContext(res, Object.assign(context, addCtx));
  }
}

var addDeps = url => fetch(url).then(res => res.text()).then(evalCode());

var deps = {
  http : "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/http/util.js",
  replClient: "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/http/repl-client.js",
}

Object.values(deps).forEach(addDeps);

```

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

var state = {}

var indexHtml = `
<html>
 <head>
   <script src="client.js"></script>
 </head>
 <body>test</body>
</html>
`;

var defaults = (request) => headers(response(indexHtml), {"Content-Type": "text/html"});

var routes = {
  ["GET /"] : defaults,
  ["GET /_dev/update"]: responseBuffer,
  ["GET /client.js"]: clientRepl
};

var middleware = (req, res) => {
  let resolve = routes[`${req.method} ${req.url}`];
  if(resolve) return resolve(req, res);
  return notFound('');
}

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
