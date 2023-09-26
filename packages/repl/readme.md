### browser 
importing in theb rowser
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

### Features Plann
- [done] add repl sockets
- [done] add http repl from poll evlutes
- [done] gsseperate evaluate, switch from backend nodejs to frontend javscript browser
- add randomize port
