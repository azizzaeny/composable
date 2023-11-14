## @zaeny/clojure.core
clojure core library functions in javascript  `@zaeny/clojure.core:1.0.0`  

###  Problem to solve

As Software Developers there are several use cases that we cannot be picky about certain development methods, ideas, and programming paradigms that we usually used daily in our work.  
for example:  
- You have recently joined an established team of developers that use object-oriented style programming and cannot use functional programming style into the team to immediately adapt and work as the way you like it.  
- You are the third party developer that needs to fix code on the production of the current development team, but you cannot convert the whole code into clojure.   
- Your team is working on javascript language while you yourself has experiencing the light of doing clojure development but you cannot bring the arguments to your bosses and college to change the whole development around it   

I have experiencing this issues and I think with providing clojure.core library or translating clojure.core to javascript can help for those people that has similiar problem that want to use functional programming clojure library but in javascript land using javascript syntax.  

### Motivation & Inspiration 
TODO: thinking in clojure and functional pgoramming 

TOOD: difference from mori

TODO: Documentations should be available offline usages

### Usage
TODO: usage, arity arguments, curry

### Implementation
- [part 01 - working with objects](./01.objects.md) `get, assoc, getIn, assocIn, dissoc, selectKeys, updateIn, merge, renameKeys, mergeWith, seq, keys, vals, zipmap`
- [part 02 - working with collections](./02.collections.md)
- [part 03 - functions compositions](./03.functions.md)
- [part 04 - checks and validations](./04.checks.md)
- [part 05 - math functions](./05.maths.md)
- [part 06 - working with string](./06.strings.md)

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
