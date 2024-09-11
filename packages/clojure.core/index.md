
specification and refrence  from: [clojuredocs](https://clojuredocs.org/)

### isColl
```clj context=spec fn=isColl
(coll? x)
```
```txt context=desc fn=isColl
Returns true if x implements IPersistentCollection
```
```js context=core fn=isColl
var isColl = (value) =>  (value !== null && typeof value === 'object');
```
```js context=test fn=isColl
isColl([]) // => true
isColl({}) // => true
isColl(null) //=> false
isColl(undefined) //=> false
isColl(NaN) //=>false
isColl('') // => false
isColl(0)  //=> false
```

### isMap
aka isObject
```clj context=spec fn=isMap
(map? x)
```
```txt context=desc fn=isMap
Return true if x implements IPersistentMap
```
```js context=core fn=isMap
var isMap = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
```
```js context=test fn=isMap
isMap({}); // => true
isMap([]); //=> false
```

### keys
```clj context=spec fn=keys
(keys map)
```
```txt context=desc fn=keys
Returns a sequence of the map's keys, in the same order as (seq map).
```
```js context=core fn=keys
var keys = (m) => Object.keys(m);
```
```js context=test fn=keys
keys({a:1, b:2}); //=> ['a', 'b'];
```

### vals
```clj context=spec fn=vals
(vals map)
```
```txt context=desc fn=vals
Returns a sequence of the map's values, in the same order as (seq map).
```
```js context=core fn=vals
var vals = (m) => Object.values(m);
```
```js context=test fn=vals
vals({a:1, b:2}); //=> [1,2]
```

### count
```clj context=spec fn=count
(count coll)
```
```txt context=desc fn=count
Returns the number of items in the collection. (count nil) returns
0.  Also works on strings, arrays, and Java Collections and Maps
```
```js context=core fn=count
var count  = (coll) =>{
  if(isMap(coll)) return keys(coll).length;
  return coll.length;
}
```
```js context=test fn=count
count([1,2]); //=> 2
count({a:1}); //=> 1
```

### conj
```clj context=spec fn=conj
(conj)(conj coll)(conj coll x)(conj coll x & xs)
```
```txt context=desc fn=conj
conj[oin]. Returns a new collection with the xs
'added'. (conj nil item) returns (item).
(conj coll) returns coll. (conj) returns [].
The 'addition' may happen at different 'places' depending
on the concrete type.
```
```js context=core fn=conj
var conj = (...[coll, ...xs]) =>{
  if(!xs || xs.length === 0) return (...xs) => conj(coll, ...xs);
  return [...coll, ...xs];
}
```
```js context=test fn=conj
conj(['a'], 'a') // ['a','a']
conj(['a', 'b'], ['c']) // ['a', 'b', ['c']]
conj(['a'], 'b', 'c') // ['a', 'b', 'c']
conj(['a'])('a') // ['a','a']
conj(['a'])('b', 'c') // ['a','b', 'c']

```

### cons
```clj context=spec fn=cons
(cons x seq)
```
```txt context=desc fn=cons
Returns a new seq where x is the first element and seq is the rest.
```
```js context=core fn=cons
var cons = (...[x, ...seq]) =>{
  if(!seq || seq.length ===0) return (...seq) => cons(x, ...seq);
  return [x].concat(...seq);
}
```
```js context=test fn=cons
cons(0,[1,2,3]) //=>[0,1,2,3]
cons(0)([1,2,3]) //=>[0,1,2,3]
```

### first

### ffirst

### rest

### get
```clj context=spec fn=get
(get map key)(get map key not-found)
``` 

```txt context=desc fn=get
Returns the value mapped to key, not-found or nil if key not present  
in associative collection, set, string, array, or ILookup instance.
```

```js context=core fn=get
var get = (...[map, key]) =>{
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
var assoc = (...[m, key, val]) => {
  if(!key && !val) return (key, val) => assoc(m, key, val);
  if(!val) return (val) => assoc(m, key, val);
  if(isMap(m)) return {...m, [key]: val};
  if(isColl(m)){
    let coll = [...m];
    return (coll[key] = val ,coll);
  }
}
```
```js context=test fn=assoc
assoc({}, 'a', 1); // => {a: 1}
assoc({}, 'a')(2); // => {a: 2}
assoc([], 0, 1); // => [1]
assoc([], 1, 1); // => [null, 1];
```

### assocIn

```clj context=spec fn=assocIn
(assoc-in m [k & ks] v)
```
```txt context=desc fn=assocIn
Associates a value in a nested associative structure, where ks is a sequence of keys and v is the new value and returns a new nested structure. If any levels do not exist, hash-maps will be created.
```
```js context=core fn=assocIn
var assocIn =(...[m, ks, v]) => {
  if(!ks || !v) return (ks, v) => assocIn(m, ks, v);
  if(!v) return (v) => assocIn(m, ks, v);
  let keys = Array.isArray(ks) ? ks : [ks];
  let [fk, ...rk] = keys;
  let val = rk.length === 0 ? v : assocIn(m[fk] || {}, rk, v);
  return assoc(m, fk, val);
}
```
```js context=test fn=assocIn
assocIn({a: 1}, ['a', 'b'], 1); //=> {a: {b: 1}};
assocIn({}, ['a', 'b', 'c'], 1) //=> { a: { b: { c: 1 } } }
assocIn({a: 1}, ['c'], 1) //=> {a: 1, c: 1}
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
  let coll = isMap(m) ? {...m} : [...m];
  return (keys.map(key => delete coll[key]), (isMap(m) ? coll : coll.filter(f => f !== null)));
}
```
```js context=test fn=dissoc
dissoc({a:1, b: 2}, 'a'); // => { b: 2}
partial(dissoc, 'a')({a: 1, b: 2}); // => { b: 2}
dissoc([1,2,3], 0); //=> [ 2, 3 ];
dissoc([1,2,3], 1); //=> [1, 3 ];
```


### update
```clj context=spec fn=update
(update m k f)(update m k f x)(update m k f x y)(update m k f x y z)(update m k f x y z & more)
```
```txt context=desc fn=update
'Updates' a value in an associative structure, where k is a
key and f is a function that will take the old value
and any supplied args and return the new value, and returns a new
structure.  If the key does not exist, nil is passed as the old value.
```
```js context=core fn=update
var update = (...[m, k, fn]) =>{
  if(!k || !fn) return (k, fn) => update(m, k, fn);
  if(!fn) return (fn) => update(m, k, fn);
  if(Array.isArray(m)){
    let coll = [...m];
    return (coll[k]= fn(coll[k]), coll);
  }
  return {...m, [k]: fn(m[k]) };
}
```
```js context=test fn=update
update({a:1, b: 2}, "b", (val) => val + 1); // => {a: 1, b: 3}
```

### updateIn
```clj context=spec fn=updateIn
(update-in m ks f & args)
```
```txt context=desc fn=updateIn
'Updates' a value in a nested associative structure, where ks is a
sequence of keys and f is a function that will take the old value
and any supplied args and return the new value, and returns a new
nested structure.  If any levels do not exist, hash-maps will be
created.
```
```js context=core fn=updateIn
var updateIn = (...[m, ks, fn]) =>{
  if(!ks || !fn) return (ks, fn) => updateIn(m, ks, fn);
  if(!fn) return (fn) => updateIn(m, ks, fn);
  let [k, ...rk] = ks;
  return (rk.length === 0)
    ? update(m, k, fn)
    : update(m, k, (v) => updateIn(v, rk, fn));  
}
```
```js context=test fn=updateIn
updateIn({ name:{ full_name: "aziz zaeny"}}, ["name", "full_name"], (val)=> val.toUpperCase()); //=> { name: { full_name: 'AZIZ ZAENY' } }
```

### merge 

```clj context=spec fn=merge
(merge & maps)
```
```txt context=desc fn=merge
Returns a map that consists of the rest of the maps conj-ed onto
the first.  If a key occurs in more than one map, the mapping from
the latter (left-to-right) will be the mapping in the result.
```
```js context=core fn=merge
var merge = (...[m, ...rest]) => {
  if(!rest || rest.length === 0) return (...rest) => merge(m, ...rest);
  return Object.assign({}, m, ...rest);
}
```
```js context=test fn=merge
merge({a:1}, {b:2}, {c:2}); //=> {a:1, b:2, c:2}
```

### mergeWith
```clj context=spec fn=mergeWith
(merge-with f & maps)
```
```txt context=desc fn=mergeWith
Returns a map that consists of the rest of the maps conj-ed onto
the first.  If a key occurs in more than one map, the mapping(s)
from the latter (left-to-right) will be combined with the mapping in
the result by calling (f val-in-result val-in-latter).
```
```js context=core fn=mergeWith
var mergeWith = (...[fn, ...maps]) => {
  if(!maps || maps.length === 0) return (...maps) => mergeWith(fn, ...maps);
  let [m, ...coll ] = maps;
  let newMap =  Object.assign({}, m, ...coll );
  return Object.entries(newMap).reduce((acc, [k, v])=> (acc[k] = fn(v), acc),{});
}
```
```js context=test fn=mergeWith
var inc = (a) => a + 1;
mergeWith(inc, {a: 1, b:2}, {c:3, a:2}); //=> { a: 3, b: 3, c: 4 }
```

### selectKeys
```clj context=spec fn=selectKeys
(select-keys map keyseq)
```
```txt context=desc fn=selectKeys
Returns a map containing only those entries in map whose key is in keys
```
```js context=core fn=selectKeys
var selectKeys = (...[m, ks]) =>{
  if(!ks) return (ks) => selectKeys(m, ks);
  return Object.fromEntries(Object.entries(m).filter(([key, value]) => ks.includes(key)));
}
```
```js context=test fn=selectKeys
selectKeys({a: 1, b:2, c:{d:3}}, ['a', 'c']); //=> { a: 1, c: { d: 3 } }
```

### renameKeys
```clj context=spec fn=renameKeys
(rename-keys map kmap)
```
```txt context=desc fn=renameKeys
Returns the map with the keys in kmap renamed to the vals in kmap
```
```js context=core fn=renameKeys
var renameKeys = (...[m, ksmap]) => {
  if(!ksmap) return (ksmap) => renameKeys(m, ksmap);
  return Object.entries(m).reduce((acc, [key, value]) => ksmap[key] ? { ...acc, [ksmap[key]]: value } : { ...acc, [key]: value }, {});
}
```
```js context=test fn=renameKeys
renameKeys({a: 1, b:2}, {"b": "intoC"}); // {a:1, intoC: 2}
```

### zipmap
```clj context=spec fn=zipmap
(zipmap keys vals)
```
```txt context=desc fn=zipmap
Returns a map with the keys mapped to the corresponding vals.
```
```js context=core fn=zipmap
var zipmap = (...[ks, vals]) =>{
  if(!vals) return (ks) => zipmap(ks, vals);
  return ks.reduce((acc, key, i)=> (acc[key]=vals[i], acc), {});
}
```
```js context=test fn=zipmap
zipmap(['a', 'b'], [1,2]); //, {a:1, b:2}
```


### into
```clj context=spec fn=into
(into)(into to)(into to from)(into to xform from)
```
```txt context=desc fn=into
Returns a new coll consisting of to-coll with all of the items of
from-coll conjoined. A transducer may be supplied.
```
```js context=core fn=into
// todo: fix into add xform
var into= (...[to, from]) =>{
  if(!from) return (from) => into(to, from);
  if(isMap(to)) return from.reduce((acc, [key, value])=> ({...acc, [key]:value}),{});
  return Object.entries(from).map(([key, value]) => [key, value]);
}
```
```js context=test fn=into
into([], {a:1, b:2}); // => [ [ 'a', 1 ], [ 'b', 2 ] ]
into({}, [['a',1], ['b', 2]]); // => { a: 1, b: 2 }
```


### partial
```clj context=spec fn=partial
(partial f) (partial f arg1) (partial f arg1 arg2 arg3 & more)
```
```txt context=desc fn=partial
Takes a function f and fewer than the normal arguments to f, and
returns a fn that takes a variable number of additional args. When
called, the returned function calls f with args + additional args.
```
```js context=core fn=partial
var partial = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};
```
```js context=test fn=partial
var getName = partial(get, 'name');
getName({ name: 'aziz zaeny'});

```




### export module 

```js context=core path=./dist/index.js

```

### export commonjs

```js context=core path=./dist/index.common.js

```

### export global variable

```js context=core path=./dist/index.def.js

```
