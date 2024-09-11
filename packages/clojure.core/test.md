## test
###  get

```js context=test id=get
get({a:1}, 'a'); // => 1 
get(['a','b','c'], 1) //=> 'b'
```

### getIn
```js context=test id=getIn
getIn({a: {b: 1}}, ['a', 'b', 'c'], 'not-found'); // not-found
getIn({a: {b: 'data'}})(['a', 'b']) // => 'data'

```

### assoc

```js context=test id=assoc
assoc({}, 'a', 1); // => {a: 1}
assoc({}, 'a')(2); // => {a: 2}

```
### partial

```js context=test id=get

var getA = partial(get, 'a');
getA({a: '10'});

```

