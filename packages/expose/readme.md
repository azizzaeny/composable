## @zaeny/Expose

[![npm version](https://img.shields.io/npm/v/@zaeny/expose.svg)](https://www.npmjs.com/package/@zaeny/expose)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/expose.svg)  

> Define and Expose REPL utiltiy

Utility Functions working with repl node.js, exposing function into global variable repl

- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)

### Getting started 

```sh
npm i @zaeny/expose
```

### Usage 

type `node` to create nodejs repl then type

```js
var {expose, evaluate, define} = require('@zaeny/expose');
```
using it 

```js

 // all varibale available in globally to invoke
define('@zaeny/clojure.core');  // {map, filter, reduce, flatten, assoc, ....}

// exposing single files exposets into global avialbe in  repl
expose('./search/routes.js'); // all exported funciton declared here available to repl

//exposing all files in the directory
expose('./search/functions/'); // find all avaialable .js file in this directory and export it to global

// evaluate to repl keep preserving repl context
evaluate()(fs.readFileSync('./state.js', 'utf8'));
```

### API

```js
define,
expose,
evaluate
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
 - [1.0.0] add `expose` `define` and `evaluate`
 - [1.0.1] fix `map`,`filter` is not defined, seperate @zaeny/clojure.core
 - [1.0.2] refactor move repository to composable
