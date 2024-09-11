
### get
`(get map key)(get map key not-found)`
Returns the value mapped to key, not-found or nil if key not present  
in associative collection, set, string, array, or ILookup instance.

```js context=core id=get

var get = (...[map, key]) => {
  if(!key) return (key) => map[key];
  return map[key];
}

```

### getIn
`(get-in m ks)(get-in m ks not-found)`
Returns the value in a nested associative structure,
where ks is a sequence of keys. Returns nil if the key
is not present, or the not-found value if supplied.

```js context=core id=getIn
// TODO: implement not-found

var getIn = (...[m, ks, notFound=undefined]) =>{
  if(!ks) return (ks) => getIn(m, ks);
  return ks.reduce((acc, key)=>{
    if(acc && typeof acc === 'object' && key in acc) return acc[key];
    return notFound;
  }, m);
}

```


### partial
`(partial f) (partial f arg1) (partial f arg1 arg2 arg3 & more)`

Takes a function f and fewer than the normal arguments to f, and
returns a fn that takes a variable number of additional args. When
called, the returned function calls f with args + additional args.

```js context=core id=partial

var partial = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

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
