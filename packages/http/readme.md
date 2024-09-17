## @zaeny/http 

[![npm version](https://img.shields.io/npm/v/@zaeny/http.svg)](https://www.npmjs.com/package/@zaeny/http)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/http.svg)  

> Simple HTTP Server in node.js    

Translate incomin http request into data strcuture like ring in clojure  
Provide basic funcitonal programming utility  creating http server  

- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)

### Getting started 

```sh
npm i @zaeny/http
```

### Usage 
basic http server, with handler accept returning object `{status, headers, body}`
```js

var { createServer, startServer, response } = require('@zaeny/http');

var mainHandler = (req, res) => ({ 
  status: 200, headers: {}, body: 'Hello world'
});

var server =  createServer({ 
  port: 8081, 
  handler: (req, res) => mainHandler(req, res)
});

startServer(server);

```

basic `response` with utility functions

```js
var { createServer, startServer, response } = require('@zaeny/http');

var handler = (req, res) => response('hello world');
var server =  startServer(
  createServer({ port: 8081, handler: (req, res) => handler(req, res)})
);

// response json, if body isArray or isObject
var handler = (req, res) => {
  return {status: 200, headers: contentType('json'), body: { is_running: true }};
}

// use response
var handler = () => response({ is_running: true}, contentType('json'));

// contentType, findFile, status, headers, created, notFound, badRequest, etc..

```


create your own simple routing

```js

var responseIndex = (req, res) => findFile('./index.html');
var getUser = (req, res) => response('fetch all  user');

var mainHandler = (req, res) => {
  let routes = {
    `GET /`: responseIndex,
    `GET /api/user`: getUser
  }
  let resolve = routes[`${req.method} ${req.path}`];
  if(resolve) return resolve(req, res);
  return notFound();
}

var server = server || startSever(
  createServer({ port: 8081, handler: (req, res) => mainHandler(req, res)})
);
```

usage with `@zaeny/clojure.core`

``` js
var {threadFirst, assoc} = require('@zaeny/clojure.core');

var info = (req, res) => response('hello world');

var server = threadFirst(
  { port: 8081, handler: info },
  [createServer],
  [startServer]
);

```

advanced routing with params :id with `findRotues`

```js

var routes = () => ({
  'GET /api/audio/chapter/:id': 'handleGetAudioByChapter',
  'GET /asset/:id': 'serveAudioAssets'  
});

var resolve = {
  serveAudioAssets,
  handleGetAudioByChapter
}

var mainHandler = (req, res) => {
  let found = findRoutes(routes(), req);
  if(found && resolve[found]){
    return resolve[found](req, res);
  }
  return notFound('404');
}

var server = threadFirst(
  { port: 8081, handler: mainHandler },
  createServer,
  startServer
);

```

testing and debuging from repl, createRequest to test the handler

```js


// create requst with headers 
createRequest('GET /api/users', {headers: {'Authorization': 'Basic aziz=pass'}});

await handler(createRequest('GET /api/search?query=Aziz'));

```

### API
```js
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
  mimeType,
  findRoutes,
  createRequest,
  notModified,
  ext
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
 - [1.0.0] expose common api dealing with creating http server
 - [1.0.1] add `findRoutes` utility basic routing `GET /api/audio/:id`, params matching and stringify body request if json
 - [1.0.2] add support for `async` handler 
 - [1.0.3] add support buffer non string request
 - [1.0.4] fix `contentType` should return not headers
 - [1.0.5] add `createRequest` to mockup request call 
 - [1.0.6] add `notModified` and fix request parser
 - [1.0.8] add fix `requst.body` parse if empty dont parse 
 - [1.0.9] add `parsing request body`, add improvement processing response
 - [1.0.10] add parsing body response if non array or object into string.
 - [1.0.11] add `response(body, headers, status)` basic construct instead single arguments, fix `findRoutes` bugs
 - [1.0.12] fix bugs `request.buffer` and `request.body` is empty when content-type `application/json`  
 - [1.0.13] fix bugs `replace` not found on `findRoutes` 
 - [1.0.13] fix bugs `reduce` not found on `findRoutes` 
