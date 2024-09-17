## @zaeny/env 

[![npm version](https://img.shields.io/npm/v/@zaeny/env.svg)](https://www.npmjs.com/package/@zaeny/env)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/env.svg)  

> Reading .env files

### Getting Started  
 ``` 
 npm install @zaeny/env
 ``` 

**Example**
create .env files `key=value` `="` and `=''` or `=`

```sh
touch .env
cat > .env <<'EOL'
FOO="Bar"
TEST=DATA
BAR='apapa'
EOL
```

usage:
```js
var {env} = require('@zaeny/env');
// or
var {env} = await import('@zaeny/env');
env()

/*
  { FOO: 'Bar', TEST: 'DATA', BAR: 'apapa'}  
  added to process.env[]
*/

// select different files
env('./environment'); 

```

### Documentation
see it here [index.md](./index.md)
 
### Changes 
 - [1.0.0] initial release, add read double quote
 - [1.0.1] add information update repositry, issues, keywords and so on 
 - [1.0.2] fix cannot get value from env that contain = like uri `?auth=admin&foo=bar`
 - [1.0.3] refactor, move to new repository composable
