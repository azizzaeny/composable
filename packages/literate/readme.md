## @zaeny/literate
{todo: check the readme, add better usage with import module, in browser}  
{todo: check the eval functions, test all}  

[![npm version](https://img.shields.io/npm/v/@zaeny/literate.svg)](https://www.npmjs.com/package/@zaeny/literate)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/literate.svg)  

> literate programming, extract code blocks from markdown file   

### Table of Contents 
- []()

### Usage 
**Node.js Installing**
 ``` 
 npm install @zaeny/literate
 
 ``` 
 **Browser Import**
 ```js
 import {extractCode} from 'https://cdn.jsdelivr.net/npm/@zaeny/literate/src/core.js';
 ```
 
**Extracting Code**  

```javascript
var {extractCode}  = require('@zaeny/literate');
// or
var {extractCode} = await import('@zaeny/litarte');

var testMdFile = fs.readFileSync('./test.md', 'utf8');
extractCode(testMdFile);
/*
  [
    { path: 'index.js', lang: 'js', code: "console.log('welcome');" },
    { path: 'index.js', lang: 'js', code: "console.log('hai');" }
  ]
*/
``` 
evaluating markdown files
```js
var {evaluateBlock} = require('@zaeny/literate');
// or
var {evaluateBlock} = await import('@zaeny/literate');

evaluateBlock(testMdFile);
/*
  welcome
  hai
*/
// more advanced,
// evaluateBlock(md, validation, context, requiredContext)
evalulateBlock(testMdFile, (file) => (file.code && file.lang === "js" && file.eval===1), global, {require, console, module });
```

extracting code blocks from markdown alias tangle

```js 
var {tangle} = require('@zaeny/literate');
var {tangle} = await import('@zaeny/literate');
tangle(testMdFile);
/*
  'tangle files: #1 index.js'
*/

tangle(testMdFile, (file) => (file.path && file.lang === "js"));
//  'tangle files: #1 index.js'
```

### Changes
- [1.0.2] `tangle` and `eval` now return object of inputed
- [1.0.5] refactor `groupBlockBy`, rename `eval` to `evalaute`, move repository to composable
