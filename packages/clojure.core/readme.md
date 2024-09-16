## Clojure.core

[![npm version](https://img.shields.io/npm/v/@zaeny/clojure.core.svg)](https://www.npmjs.com/package/@zaeny/clojure.core)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/clojure.core.svg)  

> Clojure core utility functions in javascript land    

Provide Collection of functions from clojure.core library, an attempt to look at the spec and try to implement it as simple as possible into object or array so it available in javascript ecosystem to use.

- [Getting Startd](#getting-started)  
- [Documentation](#documentation)
- [Usage](#usage)
- [Reason](#Rational)
- [Changes](#development)

### Documentation and supported functions
Current status all supported functions see [index.md](./index.md). 

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

### Usage
**CDN**
```sh 
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/core.js
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/core.min.js
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/core.cjs.js
https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/index.js
#unpkg -`https://www.unpkg.com/@zaeny/clojure.core@2.0.0/core.js`
#jsdelivr - `https://cdn.jsdelivr.net/npm/@zaeny/clojure.core`
```
**import from**
```js
import {updateIn} from 'https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/+esm';
```
```js
<script src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/core.min.js"></script>
```   

### Reason
**Solving my own problem**
As a Software Engineer, there are several scenarios where we cannot be selective about certain development methods, ideas, and programming paradigms that we typically utilize in our daily work. For instance:  

- You have recently joined an established team of developers who predominantly employ object-oriented programming, making it challenging to immediately introduce and integrate functional programming techniques.  
- You are a third-party developer tasked with resolving issues in the production code of an existing development team, but you are unable to transition the entire codebase to Clojure.  
- Despite your personal experience and preference for Clojure development, your team primarily works with JavaScript, and you encounter resistance when advocating for a transition to Clojure.  

Having encountered these challenges myself, I believe that providing access to the Clojure.core library or translating its functionalities to JavaScript can be beneficial for individuals facing similar dilemmas.   
This approach enables the utilization of functional programming paradigms inherent in Clojure within the JavaScript ecosystem, thereby addressing the needs of those who wish to leverage Clojure's functional programming capabilities while adhering to JavaScript syntax conventions.

{TODO}
**Why Clojure**
rich library functions, common naming conventions of functions, instead of Ramdajs, underscore an else an attempt to as close as possible 
Thinking in clojure and functional programming

many talks has inspired why this is opinionted
**why not mori and clojurescript**
Mori. A library for using ClojureScript's persistent data structures, mori has its own persisten data structure hasMap, sortedSet, 
where my need is just conviniently using simple object ans array but keep it using immutable 
clojurescript or cljs has it own compile langauge where we want to avoid compiling and building
we want plainly 


//todo: fix dependencies

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
 - [2.0.0] major changes, move to repository composable
