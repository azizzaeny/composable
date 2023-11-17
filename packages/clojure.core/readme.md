## composable/clojure.core
`@zaeny/clojure.core:1.0.0`  
clojure core library functions in javascript   

###  Problem to solve

As Software Developers there are several use cases that we cannot be picky about certain development methods, ideas, and programming paradigms that we usually used daily in our work.  
for example:  
- You have recently joined an established team of developers that use object-oriented style programming and cannot use functional programming style into the team to immediately adapt and work as the way you like it.  
- You are the third party developer that needs to fix code on the production of the current development team, but you cannot convert the whole code into clojure.   
- Your team is working on javascript language while you yourself has experiencing the light of doing clojure development but you cannot bring the arguments to your bosses and college to change the whole development around it   

I have experiencing this issues and I think with providing clojure.core library or translating clojure.core to javascript can help for those people that has similiar problem that want to use functional programming clojure library but in javascript land using javascript syntax.  

TODO: why clojure?  rich library functions, naming conventions of functions

### Thinking in Clojure and Functional Programming (todo)
### Difference from Mori (todo)
### Naming convention from Clojure (todo)
### Getting Started  (todo)
 - Nodejs CommonJS 
 - Nodejs Es6
 - CDN Import to Browser 
 - Copy from documentation  


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
  // atom  
  // mutli method  
}
```
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

var isEven = n => n % 2 === 0;
var numbers = [1, 2, 3, 4, 5, 6];
var result = remove(isEven, numbers); //

reduce((acc,v) => acc + v, 0, [1,23,4,5,6,77]); //
concat([1,2,3,4], [5,6,7,8])

mapcat(x => [x, x * 2], [1,2,3,4])

mapIndexed((n, i) => [n, i], [1,2,3,4,5])

flatten([1,2,[3,4],[[1,2,3,4]]])

distinct([1,2,1,2,4,5,6,6,7,6,8])

interleave([1,2,3], ["a", "b","c"]) // []
zipmap([1,2,3], ["a", "b","c"]); // {}

interpose(",", ["one", "two", "three"])

reverse([0,1,2,3])

sort([1,2,3,4,5,6,5,4,1])

sortBy((n)=> n.length, ["aaa", "bb", "c"])

compare(1, 2)

groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]);

partition(4, [1,2,3,4,5,6,7,8,9])

frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]);

union([1,2,3,4,5], [1,2,3,8,9]);

difference([1,2,3,4,5], [0, 3, 5,6]); // 1,2,4

map(constantly(10), [1,2,3,4,5])

map(identity, [1,2,3,4,5,6])

apply(get, [{a: 1}, "a"])
juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]

thread(
  22,
  (x) => x * 10,
  (x) => x +5
)

thread([22,10], map(x => x *10), map (x => x +5))

condThread(
  5,
  (x) => x > 0, (x) => x * 2,
  (x) => x < 10, (x) => x + 1,
  (x) => x % 2 === 0, (x) => x / 2
);

var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var fns = comp(addTwo, square, doubleIt); // compose
fns(3);

isContains([1,2,3,4], 2)
isNeg(-1)
incr(10)

replace("hello world", "o", "a"); // "hella warld"
capitalize("hello world"); // "Hello world"
lowerCase("HELLO WORLD"); // "hello world"
upperCase("hello world"); // "HELLO WORLD"

```


### Documentation & Implementation
the documentations and the actual code is produced by using literate programming method
- [part 01 - working with objects](./01.objects.md)   
- [part 02 - working with collections](./02.collections.md)   
- [part 03 - functions compositions](./03.functions.md)  
- [part 04 - checks and validations](./04.checks.md)  
- [part 05 - math functions](./05.maths.md)   
- [part 06 - working with string](./06.strings.md)  
- [part 07 - working with states using atom](./07.atom.md) (wip)  
- [part 08 - working with multi method](./08.multi-method.md) (wip)   
- [part 09 - transducer, reducer](./09.transducer.md) (draft)  

### Development & Test
Setup test ground on node.js repl, `node` then evaluate bellow line
to Build & Compile (todo) gather all the contents code blocks, `bin/build` will output all code into `core.js` in `dist` folder

```js path=dist/test.core.js
var assert = require('assert');
var {equal, notEqual, deepEqual} = assert;

function test(desc, fn){
  try{
    console.log('test', desc);
    fn();
    console.log('OK');
    return true;
  }catch(e){
    console.log('', desc);
    console.log('error', e);
    return false;
  }
}
var core = require('./core');
Object.assign(global, core);

```

TODO: Work In Progress
