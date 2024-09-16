## @zaeny/literate
{todo: check the readme, add better usage with import module, in browser}
{todo: check the eval functions, test all}
[![npm version](https://img.shields.io/npm/v/@zaeny/literate.svg)](https://www.npmjs.com/package/@zaeny/literate)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/literate.svg)  

> literate programming, extract code blocks from markdown file   

### Getting Started  
 ``` 
 npm install @zaeny/literate
 ``` 
**Usage**
```javascript
var {extractCode}  = require('@zaeny/literate');
var testMdFile = fs.readFileSync('./test.md', 'utf8');

extractCode(testMdFile);

/*
  [
  { path: 'index.js', lang: 'js', code: "console.log('welcome');" },
  { path: 'index.js', lang: 'js', code: "console.log('hai');" }
]
*/

var {eval} = require('@zaeny/literate/eval');
eval(testMdFile);
/*
  welcome
  hai
*/

var {tangle} = require('@zaeny/literate/tangle');
tangle(testMdFile);
/*
  'tangle files: #1 index.js'
*/
```

**More example**
```js
evalulate(testMdFile, (file) => (file.code && file.lang === "js" && file.eval===1), global, {require, console, module });
// welcome
// hai

tangle(testMdFile, (file) => (file.path && file.lang === "js"));
//  'tangle files: #1 index.js'
```

### Changes
- [1.0.2] `tangle` and `eval` now return object of inputed
- [1.0.5] refactor `groupBlockByPath`, rename `eval` to `evalaute`, move repository to composable
