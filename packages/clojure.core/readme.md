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
TODO: Naming Convention from clojure 

### Usage
TODO: usage, arity arguments, curry
TODO: isntallation & browser usage
TODO: preview 

### Available Functions

```js path=dist/core.js
module.exports = {
  // object,
  get, getIn, assoc, dissoc, update, assocIn, updateIn, merge, mergeWith, selectKeys, renameKeys, keys, vals, zipmap,
  // collections
  count, conj, cons, first, ffirst, nth, seq, peek, rest, pop, disj, takeNth, take, second, last, next, fnext, takeLast, takeWhile,
  nthrest, drop, dropLast, splitAt, shuffle, randNth, vec, subvec, repeat, range, keep, keepIndexed, sort, sortBy, compare,
  map, filter, every, remove, reduce, concat, mapcat, mapIndexed, flatten, interleave, interpose, reverse, groupBy, partition, partitionAll,
  frequencies, union, difference, intersection,
  // functions
  apply, comp, constantly, identity, fnil, memoize, everyPred, complement, partial, juxt, someFn, partialRight, partialLeft, thread, condThread,  
  // checks
  isNotEmpty, isEmpty, isContains, isIncludes, isIncludes, isZero, isPos, isNeg, isEven, isOdd, isInt, isTrue, isFalse, isInstanceOf, isSome, isFn, isDeepEqual,
  isBlank, isArray, isObject, isNumber, isString, isIdentical, isEqual, isNotEqual, isGt, isGte, isLt, isLte, isDistinct, isEveryEven, isNotEveryEven, isNotAnyEven,
  // maths
  rand, randInt, add, subtract, multiply, divide, quot, mod, rem, incr, decr, max, min, toInt, toIntSafe,
  // strings
  subs, splitLines, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewLine, trimL, trimR, char,
  // atom
  
  // mutli method  
}
```
#### Documentation & Implementation
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

### Build & Compile
gather all the contents code blocks

```js 
var fs = require('fs');

function extractCode(markdown){
  let regex = /```(\w+)((?:\s+\w+=[\w./]+)*)\s*([\s\S]*?)```/g;
  function extractParams(paramsString){
    if(paramsString){
      return paramsString.split(/\s+/).reduce((acc, params)=>{
        let [key, value] = params.split('=');
        if(key && value){
          acc[key] = isNaN(value) ? value : parseInt(value);
        }     
        return acc;
      }, {});
    }
    return {};
  }
  return [...markdown.matchAll(regex)].reduce((acc, match) => {
    let lang         = match[1];
    let paramsString = match[2];
    let code         = match[3].trim();
    let params       = extractParams(paramsString);
    return acc.concat({
      ...params,
      lang,
      code
    });
  }, []);
}

function groupByPath(extracted){
  return extracted.reduce((acc, value)=>{
    if(!acc[value['path']]){
      acc[value['path']] = value['code'];
    }else{
      acc[value['path']] = acc[value['path']].concat('\n\n', value['code'])
    }
    return acc;
  }, {})
}

var files = [
  './readme.md',
  './01.objects.md',
  './02.collections.md',
  './03.functions.md',
  './04.checks.md',
  './05.maths.md',
  './06.strings.md',
  //'./07.atom.md'
];

var bundle = files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
var code = extractCode(bundle)
var [exports, ...restCode] = code;
var blocks = restCode.concat(exports);
var groupFile = groupByPath(blocks);
var writeOut = Object.entries(groupFile).map(([file, contents]) => (fs.writeFileSync(file, contents, { flag: 'w+'}), file))

console.log('written files: ', writeOut.join(' '));
```

TODO: Work In Progress
