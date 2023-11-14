### prepare & setup 
Setup test ground on node.js repl

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

#### get 
`(get map key)(get map key not-found)` 
```js path=dist/core.js
var get = (...args) => {
  let [obj, key] = args;
  if(args.length === 2){
    return obj[key];
  }else{
    return (keyA) => obj[keyA];
  }
}
```
usage :

```js path=dist/test.core.js
test('should get object',()=>{
  let obj = {a: 1};
  assert.equal( get(obj, 'a'), 1);
});

test('should get object currid', ()=>{
  let obj = {a:1};
  let getObj = get(obj);
  assert.equal( getObj('a'), 1)
});
```

#### getIn 
`(get-in m ks)(get-in m ks not-found)`
```js path=dist/core.js

var getIn = (...args)=>{
  let [coll, keys] = args;
  if(args.length === 2){
    return keys.reduce((acc, key) =>{
      if(acc && typeof acc === "object" && key in acc){
        return acc[key];
      }else{
        return undefined;
      }
    }, coll);
  }else{
    return (keysA) => geetIn(coll, keysA);
  }
}

```
usage :
```js path=dist/test.core.js
test('should getIn nested path', ()=>{
  let obj = {a: {b: {c: 1}}};
  assert.equal(getIn(obj, ['a', 'b', 'c']), 1)
})
```

nodejs exports
```js path=dist/core.js
module.exports = {get, getIn}
```
