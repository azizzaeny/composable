
### get

```clj context=spec fn=get
(get map key)(get map key not-found)
``` 

```txt context=desc fn=get
Returns the value mapped to key, not-found or nil if key not present  
in associative collection, set, string, array, or ILookup instance.
```

```js context=core fn=get
var get = (...[map, key]) => {
  if(!key) return (key) => map[key];
  return map[key];
}
```

```js context=test fn=get
get({a:1}, 'a'); // => 1 
get(['a','b','c'], 1) //=> 'b'
```

### getIn
```clj context=spec fn=getIn
(get-in m ks)(get-in m ks not-found)
```
```txt context=desc fn=getIn
Returns the value in a nested associative structure,
where ks is a sequence of keys. Returns nil if the key
is not present, or the not-found value if supplied.
```
```js context=core fn=getIn
var getIn = (...[m, ks, notFound=undefined]) =>{
  if(!ks) return (ks) => getIn(m, ks);
  return ks.reduce((acc, key)=>{
    if(acc && typeof acc === 'object' && key in acc) return acc[key];
    return notFound;
  }, m);
}
```
```js context=test fn=getIn
getIn({a: {b: 1}}, ['a', 'b', 'c'], 'not-found'); // not-found
getIn({a: {b: 'data'}})(['a', 'b']) // => 'data'
```

### assoc 
```clj context=spec fn=assoc
(assoc map key val)(assoc map key val & kvs)
```
```txt context=desc fn=assoc
assoc[iate]. When applied to a map, returns a new map of the
same (hashed/sorted) type, that contains the mapping of key(s) to
val(s). When applied to a vector, returns a new vector that
contains val at index. Note - index must be <= (count vector).
```
```js context=core fn=assoc
var assoc = (...[m, key, val]) =>{
  if(!key && !val) return (key, val) => assoc(m, key, val);
  if(!val) return (val) => assoc(m, key, val);
  return {...m, [key]: val};
}
```
```js context=test fn=assoc
assoc({}, 'a', 1); // => {a: 1}
assoc({}, 'a')(2); // => {a: 2}
```
### dissoc
```clj context=spec fn=dissoc
(dissoc map)(dissoc map key)(dissoc map key & ks)
```
```txt context=desc fn=dissoc
dissoc[iate]. Returns a new map of the same (hashed/sorted) type,
that does not contain a mapping for key(s).
```
```js context=core fn=dissoc
var dissoc = (...[m, ...keys]) => {
  if(!keys || keys.length === []) return (...keys) => dissoc(m, ...keys);
  let coll = {...m};
  return (keys.map(key => delete coll[key]), coll);
}
```
```js context=test fn=dissoc
dissoc({a:1, b: 2}, 'a'); // => { b: 2}
partial(dissoc, 'a')({a: 1, b: 2}); // => { b: 2}
```

### partial
`(partial f) (partial f arg1) (partial f arg1 arg2 arg3 & more)`    

Takes a function f and fewer than the normal arguments to f, and
returns a fn that takes a variable number of additional args. When
called, the returned function calls f with args + additional args.

```js context=core fn=partial

var partial = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

```

try partial

```js context=test fn=partial

var getA = partial(get, 'a');
getA({a: '10'});

```




export module 

```js context=core path=./dist/index.js

```

export commonjs

```js context=core path=./dist/index.common.js

```

export global variable

```js context=core path=./dist/index.def.js

```
