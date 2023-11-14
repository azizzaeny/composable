### prepare & setup 
Setup test ground on node.js repl
why use `var` ? because we are code it up in thre repl, and we have repl workflow, const is not able to evalauted twices


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

test('should get object curried', ()=>{
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
    return (keysA) => getIn(coll, keysA);
  }
}

```
usage :

```js path=dist/test.core.js
test('should getIn nested path', ()=>{
  let obj = {a: {b: {c: 1}}};
  assert.equal(getIn(obj, ['a', 'b', 'c']), 1)
})

test('should getIn with curry args', ()=>{
  let obj = {a: {b: {c: 10}}};
  let getObj = getIn(obj);
  assert.equal(getObj(['a','b','c']), 10)
});

```
#### assoc
`(assoc map key val)(assoc map key val & kvs)`
```js path=dist/core.js
var assoc = (...args) =>{
  let [obj, key, val] = args;
  if (args.length === 3) {
    return { ...obj, [key]: val };
  } else if (args.length === 2) {
    return (val) => assoc(obj, key, val);
  }else{
    return (key, val) => assoc(obj, key, val);
  }
}

```
usage:

```js path=dist/test.core.js

test('should assoc key value', ()=>{
  let obj = {a:1};
  assert.deepEqual(assoc(obj, 'b', 20), {a:1, b:20})
});

```
#### dissoc 
`(dissoc map)(dissoc map key)(dissoc map key & ks)`

```js path=dist/core.js
var dissoc = (...args) =>{
  let [obj, key] = args;
  if(args.length === 1){
    return (keyA) => dissoc(obj, keyA);
  }
  let { [key]: omitted, ...rest } = obj;
  return rest;
}
```

usage:

```js path=dist/test.core.js
test('should dissoc key', ()=>{
  let obj = {a:1, b:2};
  assert.deepEqual(dissoc(obj, 'a'), {b:2})
});
```

#### update
`(update m k f)(update m k f x)(update m k f x y)(update m k f x y z)(update m k f x y z & more)`

```js path=dist/core.js
var update = (...args) => {
  let [object, key, updateFn] = args;
  if (args.length === 2) {
    return (updateFn) => update(object, key, updateFn);
  }
  return {
    ...object,
    [key]: updateFn(object[key])
  };
}
```

usage:

```js path=dist/test.core.js
test('should udpate object given key and functions ', ()=>{
  let obj = {a: 1, b: 2};
  let inc = (val) => val + 1;
  let res = update(obj, "b", inc);
  assert.deepEqual(res, {a: 1, b: 3});
});
```

#### assocIn
`(assoc-in m [k & ks] v)`
```js path=dist/core.js
var assocIn = (...args) =>{
  let [obj, keys, val] = args;
  if (args.length === 3) {
    keys = Array.isArray(keys) ? keys : [keys];
    return assoc(obj, keys[0], keys.length === 1 ? val : assocIn(obj[keys[0]], keys.slice(1), val));
  } else if (args.length === 2) {
    return (val) => assocIn(obj, keys, val);
  }
}
```
usage:
```js path=dist/test.core.js
test('should assoc in path given value', ()=>{
  let obj = {a: 1, b:{c: 10}};
  let res = assocIn(obj, ['b', 'c'], 20);
  assert.deepEqual(res, {a:1, b:{c: 20}});
});
```

#### updateIn
`(update-in m ks f & args)`

```js path=dist/core.js
var updateIn = (...args) =>{
  let [object, keys, updateFn] = args;
  if (args.length === 2) {
    return (updateFn) => updateIn(object, keys, updateFn);
  }
  const [key, ...rest] = keys;
  if (rest.length === 0) {
    return update(object, key, updateFn);
  }
  return update(object, key, (value) => updateIn(value, rest, updateFn));
}
```
usage:

```js
test('should updateIn path, uppercase full name', ()=>{
  let obj = {name:{ full_name: "aziz zaeny"}};
  let upperCase = (val) => val.toString().toUpperCase();
  let path = ["name", "full_name"];
  let res = updateIn(obj, path, upperCase);
  let fullName  = getIn(res, path);
  assert.equal(fullName, "AZIZ ZAENY");
})
```

nodejs exports
```js path=dist/core.js
module.exports = {get, getIn}
```
