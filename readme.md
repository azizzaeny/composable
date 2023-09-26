## Composable  
    "Composable is to make or form by combining things."   
    
    
Collection of functions that can be composed to solve programming problem.  
Library functional programming, data structure, UI development, pushing side-effects to the last  



### Packages

| Status      | Packages                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| development |[@azizzaeny/clojure.core](./packages/clojure.core/readme.md)  | translating the clojure core functions into javascript functions |


### Development
TODO  
 
### browser 
importing in the browser
```js

import {render} from 'https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/packages/hiccup/index.js';

```

### nodejs
quick importing snippets in the nodejs
```js

var vm = require('vm');
var ctx = vm.createContext(global);

function fetch(url, ct) {
  if(!ct) (ct = ctx);
  require('https').get(url, res =>{
    let data ='';
    res.on('data', chunk => (data += chunk));
    res.on('end', _ => (vm.runInContext(data, ct)));
    res.on('error', err => console.log(err));             
  }); 
}

var url = 'https://cdn.jsdelivr.net/gh/azizzaeny/composable@main/packages/repl/index.js';
fetch(url);

```

