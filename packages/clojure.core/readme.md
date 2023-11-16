## @zaeny/clojure.core
clojure core library functions in javascript  `@zaeny/clojure.core:1.0.0`  

###  Problem to solve

As Software Developers there are several use cases that we cannot be picky about certain development methods, ideas, and programming paradigms that we usually used daily in our work.  
for example:  
- You have recently joined an established team of developers that use object-oriented style programming and cannot use functional programming style into the team to immediately adapt and work as the way you like it.  
- You are the third party developer that needs to fix code on the production of the current development team, but you cannot convert the whole code into clojure.   
- Your team is working on javascript language while you yourself has experiencing the light of doing clojure development but you cannot bring the arguments to your bosses and college to change the whole development around it   

I have experiencing this issues and I think with providing clojure.core library or translating clojure.core to javascript can help for those people that has similiar problem that want to use functional programming clojure library but in javascript land using javascript syntax.  

TODO: why clojure rich library functions, naming conventions of functions

### Motivation & Inspiration 

TODO: thinking in clojure and functional pgoramming 

TOOD: difference from mori

TODO: documentations

### Usage
TODO: usage, arity arguments, curry
TODO: isntallation & browser usage
TODO: preview 

### Implementation
- [part 01 - working with objects](./01.objects.md)   
`get, assoc, getIn, assocIn, dissoc, selectKeys, updateIn, merge, renameKeys, mergeWith, seq, keys, vals, zipmap,`   
- [part 02 - working with collections](./02.collections.md)   
`count, conj, cons, first, ffirst, nth, peek, rest, pop, disj, take, takeNth, second, last, next, nfirst, nnext,`   
`fnext, takeLast, takeWhile, drop, dropFirst, nthrest, splitAt, splitWith, randNth, shuffle, whenFirst, subvec,`   
`range, keep, keepIndexed, find, map, filter, remove, every, reduce, concat, mapcat, mapIndexed, flatten, distinct,`  
`interleave, interpose, reverse, sort, sortBy, compare, groupBy, partition, partitionAll, partitionBy, frequencies, union, difference, intersection,`   
- [part 03 - functions compositions](./03.functions.md)  
`apply, comp, thread, threadAs, threadLast, condThread, condThreadLast, someThread, some, constantly, identity, fnil, memoize, every, complement, partial, juxt, someFn,`   
- [part 04 - checks and validations](./04.checks.md)  
`isNotEmtpy, isEmpty, isContains, isIncludes, isZero, isPos, isNeg, isOdd, isInt, isTrue, isFalse, isInstanceOf, `  
`isSome, isFn, isBlank, isArray, isNumber, isObject, isString, isColl, isSubset, isSuperset, isDistinct, isEmptyArray,`   
`isNil, isEqual, isDeepEqual, isEveryEven, isNotEeveryEven, isNotAnyEven, isGet, isNotEqual, isGt, isGte, isLt, isLte,`  
- [part 05 - math functions](./05.maths.md)   
`rand, randInt, add, subtract, multiply, divide, quot, mod, rem, incr, decr, max, min, toInt, toIntSafe,`  
- [part 06 - working with string](./06.strings.md)  
`subs, splitLines, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewLine, tirmL, trimR, char,`  
- [part 07 - working with states using atom](./07.atom.md) (wip)  
`atom, deref, reset, swap, compareAndSet, removeWatch, addWatch, setValidator, getValdiator,`  
- [part 08 - working with multi method](./08.multi-method.md) (wip)   
`defMulti, defMethod`  
- [part 09 - transducer, reducer](./09.transducer.md) (draft)  
`(todo)`   

### Development & Test
Setup test ground on node.js repl, `node` then evaluate bellow line

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
```

### Build & Compile

```sh
```

TODO: Work In Progress
