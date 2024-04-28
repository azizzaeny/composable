## Composable  

Collection of functions that can be composed to solve programming problem.  
Provide reusable toolkit, General purpose library Functional Programming, Pattern & side-effects modules, Data structure algorithm


    Composable is to make or form by combining things.   
    
TODO: {WIP}        

### Getting Started 
all snippets available to downlaod or fetched via cdn

Usage in nodejs
```javascript

var evaluate= (...args) => {
  let [vm=require('vm'), ctx=global, addCtx={console, require, module}] = args;
  return (res) => {
    let context = vm.createContext(ctx);
    return vm.runInContext(res, Object.assign(context, addCtx));
  }
}

var writeFile = (file) => (data) => fs.writeFileSync(file, data);
var addDeps = (url, file) => fetch(url).then(res => res.text()).then( file ? (writeFile(file) : evaluate()));


```
loading in main function

```js
var main = () => console.log('dependencies loaded, lets start!')

var deps = {
  http : "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/http/util.js",
  redis: "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/redis/util.js",
  mongo: "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/mongo/util.js",
}

// single
addDeps(deps.http, './http.js')

// or multiple evaluate
Promise.all([
  addDeps(deps.http),
  addDeps(deps.redis)
]).then(main);

// or Promise.all(Object.values(deps).map(addDeps)).then(main);
```

usage in browser

```js

var deps = {
  hiccup : "https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/snippets/hiccup/index.js",
}

var assignVar = (global, name) => res => Object.assign(global, { [name]: (res.default) });

import(deps.hiccup).then(assignVar(window, "hiccup"));


```
### Snippets

| Status      | Snippets                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| developemnt | [hiccup](./snippets/hiccup/readme.md) | UI building with hiccup |
| development | [http](./snippets/http/readme.md) | Basic utility setup nodejs http server |
| development | [redis](./snippets/redis/readme.md) | Functional programming utility dealing with redis |
| development | [mongo](./snippets/mongo/readme.md) | Mongodb wrapper expose two main function `query` and `transact` |
| development | (wip) [aof](./snippets/aof/readme.md) | Efficient appendonly log json |
| development | (wip) [mql](./snippets/mql/readme.md) | Mongodb Query Langauge in memory |

### Packages

| Status      | Packages                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| development | [@zaeny/clojure.core](https://github.com/azizzaeny/clojure.core)  | Translating the clojure core functions into javascript functions |
| development | [@zaeny/literate](https://github.com/azizzaeny/literate)  | Literate programming, extracting code markdown |
| development | [@zaeny/env](https://github.com/azizzaeny/env)  | Read .env files |

### Workflow

first we create snippets, if it good enough, and not have bugs or issue,  we level it up into a package

### Contribute
TODO: {WIP}
