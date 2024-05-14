## Composable  

Collection of functions that can be composed to solve programming problem.  
Provide reusable toolkit, General purpose library Functional Programming, Pattern & side-effects modules, Data structure algorithm

    Composable is to make or form by combining things.   



### Packages

| Status      | Packages                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| development | [@zaeny/clojure.core](https://github.com/azizzaeny/clojure.core)  | Translating the clojure core functions into javascript functions |
| development | [@zaeny/literate](https://github.com/azizzaeny/literate)  | Literate programming, extracting code markdown |
| development | [@zaeny/env]()  | Read .env files |
| developemnt | [@zeny/hiccup](https://github.com/azizzaeny/hiccup) | UI building with hiccup |
| development | [@zaeny/http](https://github.com/azizzaeny/http) | Basic utility setup nodejs http server |
| development | [@zaeny/redis](https://github.com/azizzaeny/redis) | Functional programming utility dealing with redis |
| development | [@zaeny/mongodb](https://github.com/azizzaeny/mongodb) | Mongodb wrapper expose two main function `query` and `transact` |
| development | [@zaeny/expose](https://github.com/azizzaeny/expose) | Utility Functions working with repl node.js |

### Snippets

| Status      | Snippets                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| development | (wip) [aof](./snippets/aof/readme.md) | Efficient appendonly log json |
| development | (wip) [mql](./snippets/mql/readme.md) | Mongodb Query Langauge in memory |

### Getting Started 
todo:
all snippets available to downlaod or fetched via cdn

Usage in node.js npm install

```
npm i @zaeny/{package}
```

usage in repl without downloading sepecific the package

```js

var evaluate= (opt) => {
  if(!opt){opt = { ctx: global, addCtx: {console, require, module}}; }    
  return (res) => {
    let vm = require('vm');
    let context = vm.createContext(opt.ctx);
    return vm.runInContext(res, Object.assign(context, opt.addCtx));
  }
}

var addDeps = (url) => fetch(url).then(res => res.text()).then(evaluate(null));

//  note: use your favorite cdn js
var packages = {
  'clojure.core' : 'https://fastly.jsdelivr.net/npm/@zaeny/clojure.core',
  'http': 'https://fastly.jsdelivr.net/npm/@zaeny/http'
}

addDeps(packages['clojure.core']) // avaialabe map, filter, assoc, getIn, etc...
addDeps(packages['http'])  // createServer, startServer

```

usage in browser import

```js

var deps = {
  hiccup : "https://fastly.jsdelivr.net/gh/azizzaeny/composable@main/snippets/hiccup/index.js",
}

var assignVar = (global, name) => res => Object.assign(global, { [name]: (res.default) });


// importing via import api
import(deps.hiccup).then(assignVar(window, "hiccup"));

```

usage with fetch api
todo:

usage by creating script directly 
todo:

### Workflow

first we create snippets, if it good enough, and not have bugs or issue,  we level it up into a package

### Contribute
TODO: {WIP}
