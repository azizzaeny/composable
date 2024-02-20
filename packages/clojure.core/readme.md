## @zaeny/clojure.core
[![npm version](https://img.shields.io/npm/v/@zaeny/clojure.core.svg)](https://www.npmjs.com/package/@zaeny/clojure.core)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/clojure.core.svg)  

clojure core functions in javascript   

[composable packages](https://github.com/azizzaeny/composable/) composable utility functions for functional programming in javascript.  

- [Usage](#usage)
- [Problem to Solve](#problem-to-Solve)
- [Thinking in Clojure and Functional Programming](#thinking-in-clojure-and-functional-programming)
- [Difference from Mori and Clojurescript](#difference-from-mori-and-clojurescript)
- [Naming convention from Clojure](#naming-convention-from-clojure)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Development](#development)

### Usage 
see documentation bellow to explore the detail functions

```js
var obj = {a:1}
get(obj, 'a'); // 1
// arity functions, curry arguments
get(obj)('a');  // 1

var obj = {a: {b: {c: 1}}};
getIn(obj, ['a', 'b', 'c']); // 1

var obj = {a:1};
assoc(obj, 'b', 20); //  {a:1,b:20}

var obj = {a: 1, b:{c: 10}};
assocIn(obj, ['b', 'c'], 20)

first([1,2]); //1
ffirst([[0, 1], [1,2]]) //0

peek([1,2,3,4]); // 4

rest([1,2,3]); // [2,3]

conj(['a'], 'b', 'c') //['a', 'b', 'c']

cons(0,[1,2,3]) //[0,1,2,3]
take(2, [1,2,3,4,5,6,7,8]) // [1,2]
range(0, 10); // [0,1,2,3,4,5,6,7,8,9,10]

find(n=> n === 2, [1,2,3,4,5,6]) ; // 2

remove(isEven, [1, 2, 3, 4, 5, 6]); //[1,3,5]

reduce((acc,v) => acc + v, 0, [1, 23,4,5,6,77]); // 116
concat([1,2,3,4], [5,6,7,8]); // [1,2,3,4,5,6,7,8]

mapcat(x => [x, x * 2], [1,2,3,4]); // [1,2,2,4,3,6,4,8]

mapIndexed((n, i) => [n, i], [1,2,3,4,5]); // [ [ 1, 0 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ], [ 5, 4]]

flatten([1,2,[3,4],[[1,2,3,4]]]) // [1,2,3,4,1,2,3,4]

distinct([1,2,1,2,4,5,6,6,7,6,8]) // [1,2,3,5,6,7,8]

interleave([1,2,3], ["a", "b","c"]) // [1, 'a', 2, 'b', 3, 'c']
zipmap([1,2,3], ["a", "b","c"]); // { '1': 'a', '2': 'b', '3': 'c' }

interpose(",", ["one", "two", "three"]) // [ 'one', ',', 'two', ',', 'three' ]

reverse([0,1,2,3]); // [ 'one', ',', 'two', ',', 'three' ]

sort([1,2,3,4,5,6,5,4,1]); //[ 1, 1, 2, 3, 4, 4, 5, 5 ,6]

sortBy((n)=> n.length, ["aaa", "bb", "c"]); //[ 'c', 'bb', 'aaa' ]

compare(1, 2) ; // -1

groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]); // { false: [ -1, -9, -2 ], true: [ 2, 3, 4, 5 ] }

partition(4, [1,2,3,4,5,6,7,8,9]); //[ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9 ] ]

frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]); // { '1': 3, '2': 3, '3': 1, '4': 1, '5': 1, '6':1, '7': 1, '8': 2 }

union([1,2,3,4,5], [1,2,3,8,9]); // [1,2,3,4,5,8,9]

difference([1,2,3,4,5], [0, 3, 5,6]); // [1,2,4]

map(constantly(10), [1,2,3,4,5]); // [ 10, 10, 10, 10, 10 ]

map(identity, [1,2,3,4,5,6]) //[1,2,3,4,5,6]

apply(get, [ {a: 1}, "a" ]) // 1
juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]

thread(
  22,
  (x) => x * 10,
  (x) => x +5
); //225

thread([22,10], map(x => x *10), map (x => x +5)) //[225, 105]

condThread(
  5,
  (x) => x > 0, (x) => x * 2,
  (x) => x < 10, (x) => x + 1,
  (x) => x % 2 === 0, (x) => x / 2
); // 5

var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var composeFn = comp(addTwo, square, doubleIt); // compose
composeFn(3); // 38


isContains([1,2,3,4], 2) // true 
isNeg(-1) // true
incr(10) // 11

replace("hello world", "o", "a"); // "hella warld"
capitalize("hello world"); // "Hello world"
lowerCase("HELLO WORLD"); // "hello world"
upperCase("hello world"); // "HELLO WORLD"

```

### Getting Started  
 - Nodejs 
 ``` npm install @zaeny/clojure.core ```
  - CommonJS 
  ```js var {get, getIn} = require("@zaeny/clojure.core"); 
  ```
  - Es6
  ```js
  import {peek, assoc} from "@zaeny/clojure.core";
  ```
 - CDN Import to Browser 
    - browser
   ```js
   <script src="https://cdn.jsdelivr.net/npm/@zaeny/clojure.core"></script>
   ```   
   - es6 
   ```js
   import {updateIn} from ' https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/+esm';
   ```
   - es5 export (load non default file)
   ```js 
   https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.js
   https://cdn.jsdelivr.net/npm/@zaeny/clojure.core/dist/core.min.js
   ```
   
###  Problem to Solve

As Software Developers there are several use cases that we cannot be picky about certain development methods, ideas, and programming paradigms that we usually used daily in our work.  
for example:  
- You have recently joined an established team of developers that use object-oriented style programming and cannot use functional programming style into the team to immediately adapt and work as the way you like it.  
- You are the third party developer that needs to fix code on the production of the current development team, but you cannot convert the whole code into clojure.   
- Your team is working on javascript language while you yourself has experiencing the light of doing clojure development but you cannot bring the arguments to your bosses and college to change the whole development around it   

I have experiencing this issues and I think with providing clojure.core library or translating clojure.core to javascript can help for those people that has similiar problem that want to use functional programming clojure library but in javascript land using javascript syntax.  

TODO: why clojure?  rich library functions, naming conventions of functions

### Thinking in Clojure and Functional Programming
(todo)
### Difference from Mori and Clojurescript
(todo)
### Naming convention from Clojure 
(todo)


###  Supported Functions  
Current status all supported functions  
```js path=dist/core.js
module.exports = {
  // object,
  get, getIn, assoc, dissoc, update, assocIn, updateIn, merge, mergeWith, selectKeys, renameKeys, keys, vals, zipmap,
  // collections
  count, conj, cons, first, ffirst, nth, seq, peek, rest, pop, disj, takeNth, take, second, last, next, fnext, takeLast, takeWhile, distinct, 
  nthrest, drop, dropLast, splitAt, shuffle, randNth, vec, subvec, repeat, range, keep, keepIndexed, sort, sortBy, compare, nfirst, nnext,
  map, filter, reduce, find,every, remove, concat, mapcat, mapIndexed, flatten, interleave, interpose, reverse, groupBy, partition, partitionAll, partitionBy,
  frequencies, union, difference, intersection,
  // functions
  apply, comp, constantly, identity, fnil, memoize, everyPred, complement, partial, juxt, someFn, partialRight, partialLeft, thread, condThread,  
  // checks
  isNotEmpty, isEmpty, isContains, isIncludes, isIncludes, isZero, isPos, isNeg, isEven, isOdd, isInt, isTrue, isFalse, isInstanceOf, isSome, isFn, isDeepEqual, isNil,
  isBlank, isArray, isObject, isNumber, isString, isIdentical, isEqual, isNotEqual, isGt, isGte, isLt, isLte, isDistinct, isEveryEven, isNotEveryEven, isNotAnyEven, isColl,
  // maths
  rand, randInt, add, subtract, multiply, divide, quot, mod, rem, incr, decr, max, min, toInt, toIntSafe,
  // strings
  subs, splitLines, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewLine, trimL, trimR, char,
  // state
  atom, deref, reset, swap, addWatch, removeWatch, setValidator, compareAndSet, removeValidator,
  // mutli method  
}
```

### Documentation
the implementation and the actual code is produced by literate programming method

- [part 01 - working with objects](./01.objects.md)   
- [part 02 - working with collections](./02.collections.md)   
- [part 03 - functions compositions](./03.functions.md)  
- [part 04 - checks and validations](./04.checks.md)  
- [part 05 - math functions](./05.maths.md)   
- [part 06 - working with string](./06.strings.md)  
- [part 07 - working with states using atom](./07.atom.md)
- [part 08 - working with multi method](./08.multi-method.md) (wip)   
- [part 09 - transducer, reducer](./09.transducer.md) (draft)  

### Development 
TODO: explain better
Setup test ground on node.js repl, `node` then evaluate bellow line
to Build & Compile (todo) gather all the contents code blocks, `bin/build` will output all code into `core.js` in `dist` folder

TODO: Work In Progress

### Changes
 - [1.0.1] add atom functions `reset, swap, compareAndSet, addWatch, removeWatch, setValidator`
 - [1.0.2] fix Readme.md
