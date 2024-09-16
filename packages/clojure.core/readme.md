## Clojure.core

[![npm version](https://img.shields.io/npm/v/@zaeny/clojure.core.svg)](https://www.npmjs.com/package/@zaeny/clojure.core)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/clojure.core.svg)  

> Clojure core utility functions in javascript land    

This library provides a collection of functions inspired by the clojure.core library, reimagined to work with JavaScript arrays and objects. It aims to bring simple, functional programming concepts from Clojure into the JavaScript ecosystem.

### Table of Contents  
- [Usage](#Usage)  
- [Purpose](#Purpose)  
- [Reasoning](#Reasoning)  
- [Motivation](#Motivation)  
- [Documentation](#Documentation)  
- [Changes](#Changes)  

### Usage

**Importing from a CDN**
```js
import {getIn, assoc, updateIn} from 'https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/+esm';
```
Alternatively, you can use it directly in your HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.min.js"></script>
<script type="module" src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/+esm"></script>  
```   
**Node.js commonjs and module** 
```js
var {getIn} = require('@zaeny/clojure.core');
```
or 
```js
var {getIn} = await import('@zaeny/clojure.core');
import {getIn} from '@zaney/clojure.core/src/getIn.js'; // individually
```
**CDN**  
You can include the library in your project via CDN:
```sh 
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.js # single code base var
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.min.js # minified version
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.cjs.js # module.exports node.js
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/index.js # sepearated module

# unpkg -`https://www.unpkg.com/@zaeny/clojure.core@2.0.0/core.js`
# jsdelivr - `https://cdn.jsdelivr.net/npm/@zaeny/clojure.core`
```

### Purpose  
As a software engineer, I've encountered situations where introducing certain development paradigms, like functional programming, was challenging due to team preferences, existing codebases, or project constraints. This library is an attempt to bridge that gap by offering Clojure-inspired core functions that are compatible with JavaScript.

### Reasoning  
There are several reasons why a developer might want Clojure-like utilities in JavaScript, including:

- Team Constraints:  
You’ve joined an established team that primarily uses object-oriented programming (OOP), making it difficult to introduce and integrate functional programming techniques like those in Clojure.

- Third-Party Developer Role:  
You are brought in as a third-party developer to solve issues in a codebase maintained by a team that’s unfamiliar with Clojure or functional programming. You cannot transition the entire project to Clojure but still want to apply functional principles where possible.

- Clojure Experience vs. JavaScript Reality:  
Despite your experience and preference for Clojure, you’re working in a JavaScript environment where convincing the team to adopt ClojureScript is not feasible.

- Naming Conventions & Complexity:  
Existing libraries like Ramda.js or Underscore.js offer functional utilities but follow their own naming conventions and sometimes introduce unnecessary complexity (e.g., special hashMaps, persistent data structures). If you’re looking for a simpler solution to handle immutable operations on arrays and objects without these additional abstractions, this library can help.

### Motivation  
Having faced these challenges myself, I decided to create this library to provide essential functions from the Clojure core in a form that’s easy to use within JavaScript. This way, developers can apply Clojure’s powerful functional paradigms without needing to fully switch to a new language or disrupt their team's workflow.

By offering a familiar yet streamlined approach to immutable operations on arrays and objects, this library enables JavaScript developers to harness the power of functional programming without introducing complex new data structures or external dependencies.

### Documentation and supported functions
You can view the current list of supported functions in the library by checking the [index.md](./index.md).

Here are some example usages of the supported functions:
```js
getIn({a: {b: {c: 1}}}, ['a', 'b', 'c']); // 1
assoc({a:1};, 'b', 20); //  {a:1,b:20}
assocIn({a: 1, b:{c: 10}};, ['b', 'c'], 20)
peek([1,2,3,4]); // 4
rest([1,2,3]); // [2,3]
remove(isEven, [1, 2, 3, 4, 5, 6]); //[1,3,5]
reduce((acc,v) => acc + v, 0, [1, 23,4,5,6,77]); // 116
mapcat(x => [x, x * 2], [1,2,3,4]); // [1,2,2,4,3,6,4,8]
mapIndexed((n, i) => [n, i], [1,2,3,4,5]); // [ [ 1, 0 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ], [ 5, 4]]
interleave([1,2,3], ["a", "b","c"]) // [1, 'a', 2, 'b', 3, 'c']
zipmap([1,2,3], ["a", "b","c"]); // { '1': 'a', '2': 'b', '3': 'c' }
interpose(",", ["one", "two", "three"]) // [ 'one', ',', 'two', ',', 'three' ]
map(identity, [1,2,3,4,5,6]) //[1,2,3,4,5,6]
apply(get, [ {a: 1}, "a" ]) // 1
```

### Changes
 - [1.0.1] add atom functions `reset, swap, compareAndSet, addWatch, removeWatch, setValidator`
 - [1.0.2] fix Readme.md
 - [1.1.0] add `threadLast, threadFirst`, fix function arity `atom` `string` and `math`
 - [1.1.3] fix arguments of function check of all object `assoc`, `update`, `updateIn` etc
 - [1.1.4] add `into`
 - [1.1.5] fix atom function return  `reset, swap`
 - [1.1.6] add `doseq` functions side effects
 - [1.1.7] fix `assocIn` bugs only accept two nested keys `["key1", "key2"]`
 - [1.1.8] add aliases for `partialL`, `partailR`, `threadF`, `threadL`
 - [1.2.0] add `split` functions
 - [1.2.1] add `isBoolean` functions
 - [1.2.2] fix `concat` not accepting more arguements
 - [2.0.0] major breaking changes, moved to new repository composable, refactored arguments some functions see details [index.md](./index.md).
 - [2.0.1] fix readme add more documentation, add missing readme.md from published, add source file src/ into published
 - [2.0.2] fix wrong cdn import from dist directory
 - [2.0.3] fix dependencies `update`, `partial`, `threadf`
 - [2.0.4] add support for both commonjs and type module
 - [2.0.5] rename file into proper mjs and cjs 
 - [2.0.7] fix index.mjs wrong import .js
