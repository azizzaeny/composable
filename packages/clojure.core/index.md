
specification and refrence  from: [clojuredocs](https://clojuredocs.org/)


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

### apply
```clj context=spec fn=apply
(apply f args)(apply f x args)(apply f x y args)(apply f x y z args)(apply f a b c d & args)
```
```txt context=desc fn=apply
Applies fn f to the argument list formed by prepending intervening arguments to args.
```
```js context=core fn=apply
var apply = (...argv) => {
  let [fn, ...args] = argv;  
  return (argv.length === 1) ? (argn) => apply(fn, argn) : fn(...args);
}
```
```js context=test fn=apply
apply(get, {a: 1}, "a"); // 1
apply(assoc, {}, 'a', 20); // {a: 20};
```

### comp
```clj context=spec fn=comp
(comp)(comp f)(comp f g)(comp f g & fs)
```
```txt context=desc fn=comp
Takes a set of functions and returns a fn that is the composition
of those fns.  The returned fn takes a variable number of args,
applies the rightmost of fns to the args, the next
fn (right-to-left) to the result, etc.
```
```js context=core fn=comp
var comp = (...fns) => {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}
```
```js context=test fn=comp
var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var calculate = comp(addTwo, square, doubleIt); // right -> to left, start from doubleIt
calculate(3); // 38
```

### constantly
```clj context=spec fn=constantly
(constantly x)
```
```txt context=desc fn=constantly
Returns a function that takes any number of arguments and returns x.
```
```js context=core fn=constantly
var constantly = (x) => {
  return function() {
    return x;
  };
}
```
```js context=test fn=constantly
[1,2,3,4,5].map(constantly(10)); // [10, 10, 10, 10, 10]
```

### identity
```clj context=spec fn=identity
(identity x)
```
```txt context=desc fn=identity
Returns its argument.
```
```js context=core fn=identity
var identity = (x) =>  x;
```
```js context=test fn=identity
[1,2,3,4,5,6].map(identity); //=>[1,2,3,4,5,6]
[1,2,3,null,4,false,true,1234].filter(identity); // [ 1, 2, 3, 4, true, 1234 ]
identity(4); // 4
```

### fnil
```clj context=spec fn=fnil
(fnil f x)(fnil f x y)(fnil f x y z)
```
```txt context=desc fn=fnil
Takes a function f, and returns a function that calls f, replacing
a nil first argument to f with the supplied value x. Higher arity
versions can replace arguments in the second and third
positions (y, z). Note that the function f can take any number of
arguments, not just the one(s) being nil-patched.
```
```js context=core fn=fnil
var fnil = (f, x) =>{
  return function() {
    const args = Array.from(arguments);
    const numArgs = f.length;
    while (args.length < numArgs) { args.push(x); }
    return f.apply(null, args);
  };
}
```
```js context=test fn=fnil
var sayhello = fnil((name) => "Hello " + name, "Sir")
sayhello('aziz'); // 'hello aziz'
sayhello(); // hello sir

```

### memoize
```clj context=spec fn=memoize
(memoize f)
```
```txt context=desc fn=memoize
Returns a memoized version of a referentially transparent function. The memoized version of the function keeps a cache of the mapping from arguments to results and, when calls with the same arguments are repeated often, has higher performance at the expense of higher memory use.
```
```js context=core fn=memoize
var memoize = (f) =>{
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const result = f(...args);
      cache.set(key, result);
      return result;
    }
    return cache.get(key);
  };
}
```
```js context=test fn=memoize
var myfn = (a) => (console.log('hai'), (a+1));
var memohai = memoize(myfn)
memohai(1); // print hai 2
memohai(1); // 2
memohai(2); // print hai 3
memohai(2); //3
```

### complement
```clj context=spec fn=complement
(complement f)
```
```txt context=desc fn=complement
Takes a fn f and returns a fn that takes the same arguments as f,
has the same effects, if any, and returns the opposite truth value.
```
```js context=core fn=complement
var complement = (f) => {
  return function(...args) {
    return !f(...args);
  };
}
```
```js context=test fn=complement
var empty = (arr) => arr.length === 0;
var isNotEmpty = complement(empty);
isNotEmpty([]); // false
```

### juxt
```clj context=spec fn=juxt
(juxt f)(juxt f g)(juxt f g h)(juxt f g h & fs)
```
```txt context=desc fn=juxt
Takes a set of functions and returns a fn that is the juxtaposition
of those fns.  The returned fn takes a variable number of args, and
returns a vector containing the result of applying each fn to the
args (left-to-right).
((juxt a b c) x) => [(a x) (b x) (c x)]
```
```js context=core fn=juxt
var juxt =(...fns) => {
  return function(...args) {
    return fns.map(function(fn) {
      return fn(...args);
    });
  };
}
```
```js context=test fn=juxt
juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]
```


### someFn
```clj context=spec fn=someFn
(some-fn p)(some-fn p1 p2)(some-fn p1 p2 p3)(some-fn p1 p2 p3 & ps)
```
```txt context=desc fn=someFn
Takes a set of predicates and returns a function f that returns the first logical true value
returned by one of its composing predicates against any of its arguments, else it returns
logical false. Note that f is short-circuiting in that it will stop execution on the first
argument that triggers a logical true result against the original predicates.
```
```js context=core fn=someFn
var someFn = (...fns) =>{
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (fns[i](x)) {
        return true;
      }
    }
    return false;
  };
}
```
```js context=test fn=someFn
someFn((n) => n % 2 === 0)(2); // true
```
### partialRight
```clj context=spec fn=partialRight
;; not-exists
```
```txt context=desc fn=partialRight
not-exists
```
```js context=core fn=partialRight
var partialRight = (fn, ...leftArgs) => {
  return (...rightArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};
```
```js context=test fn=partialRight
var myfn1 = (a, b, c, d) => a + b + c + d;
var newFn = partialRight(myfn1, 'a', 'z', 'i');
newFn('z'); // 'aziz'
```

### or

```clj context=spec fn=or
(or)(or x)(or x & next)
```
```txt context=desc fn=or
Evaluates exprs one at a time, from left to right. If a form
returns a logical true value, or returns that value and doesn't
evaluate any of the other expressions, otherwise it returns the
value of the last expression. (or) returns nil.
```
```js context=core fn=or
var or = (...args) =>  args.find(Boolean) || false;
```
```js context=test fn=or
or(); //false
or(false); // false
or(true, false); // true
or(false, null, 0, '', 'hello'); // 'hello'
or(false, 0, undefined, 42); // 42
```

### and 
```clj context=spec fn=and
(and)(and x)(and x & next)
```
```txt context=desc fn=and
Evaluates exprs one at a time, from left to right. If a form returns logical false (nil or false), and returns that value and doesn't evaluate any of the other expressions, otherwise it returns the value of the last expr. (and) returns true.
```
```js context=core fn=and
var and = (...tests) =>  tests.every(Boolean);
```
```js context=test fn=and
and(true, 1, 'non-empty', {}); // true
```

### complement
```clj context=spec fn=complement
(complement f)
```
```txt context=desc fn=complement
Takes a fn f and returns a fn that takes the same arguments as f,
has the same effects, if any, and returns the opposite truth value.
```
```js context=core fn=complement
var complement = (f) => {
  return (...args) => !f(...args);
};
```
```js context=test fn=complement
var isPositive = (n) => n > 0;
var isNotPositive = complement(isPositive);
isNotPositive(-5); // true
isNotPositive(5); // false
```

### doseq
```clj context=spec fn=doseq
(doseq seq-exprs & body)
```
```txt context=desc fn=doseq
Repeatedly executes body (presumably for side-effects) with
bindings and filtering as provided by "for".  Does not retain
the head of the sequence. Returns nil.
```
```js context=core fn=doseq
var doseq = (seq, bodyFn) => {
  seq.forEach(item => bodyFn(item) );
};
```
```js context=test fn=doseq
doseq([1, 2, 3], (x) => console.log(`Item: ${x}`));
```

### dof
```clj context=spec fn=dof
(do &expr)
```
```txt context=desc fn=dof
Evaluates the expressions in order and returns the value of the last. If no
expressions are supplied, returns nil. See http://clojure.org/special_forms
for more information.
```
```js context=core fn=dof
var dof = (...exprs) => {
  let result;
  exprs.forEach(fn => {
    result = fn();
  });
  return result;
};
```
```js context=test fn=dof
dof(
  () => console.log("First expression"),
  () => console.log("Second expression"),
  () => "Last expression result"
); // last expression results
```


### isGt
```clj context=spec fn=isGt
(> x)(> x y)(> x y & more)
```
```txt context=desc fn=isGt
Returns non-nil if nums are in monotonically decreasing order, otherwise false.
```
```js context=core fn=isGt
var isGt = (a, b) => {
  if(!b) return (b) => isGt(a, b);
  return a > b;
}
```
```js context=test fn=isGt
isGt(10, 20); // false
```

### isGte 
```clj context=spec fn=isGte
(>= x)(>= x y)(>= x y & more)
```
```txt context=desc fn=isGte
Returns non-nil if nums are in monotonically non-increasing order, otherwise false.
```
```js context=core fn=isGte
var isGte = (a, b) => {
  if(!b) return  (b) => isGte(a,b);
  return a >= b;
}
```
```js context=test fn=isGte
isGte(10)(100); // false
```

### isLt
```clj context=spec fn=isLt
(< x)(< x y)(< x y & more)
```
```txt context=desc fn=isLt
Returns non-nil if nums are in monotonically increasing order, otherwise false.
```
```js context=core fn=isLt
var isLt = (a, b) => {
  if(!b) return (b) => isLt(a, b);
  return a < b;
}
```
```js context=test fn=isLt
isLt(10, 20);
```

### isLte
```clj context=spec fn=isLte
(<= x)(<= x y)(<= x y & more)
```
```txt context=desc fn=isLte
Returns non-nil if nums are in monotonically non-decreasing order, otherwise false.
```
```js context=core fn=isLte
var isLte = (a, b) => {
  if(!b) return (b) => isLt(a, b);
  return a <= b;
}
```
```js context=test fn=isLte
isLte(10, 10);
```

### isEqual
```clj context=spec fn=isEqual
(== x)(== x y)(== x y & more)
```
```txt context=desc fn=isEqual
Equality. Returns true if x equals y, false if not.
```
```js context=core fn=isEqual
var isEqual = (...args) =>{
  let [a, b] = args;
  if(args.length === 1) return (b) => isEqual(a, b);  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  } else if (typeof a === 'object' && typeof b === 'object') {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!isEqual(a[key], b[key])) return false;
    }
    return true;
  } else {
    return a === b;
  }
}
```
```js context=test fn=isEqual
isEqual(10, 10);
isEqual({a:1, b:{c:1}}, {a:1, b:{c:1}}); // true
```

### isZero
```clj context=spec fn=isZero
(zero? num)
```
```txt context=desc fn=isZero
Returns true if num is zero, else false
```
```js context=core fn=isZero
var isZero = (x) =>  x === 0;
```
```js context=test fn=isZero
isZero(0);
```

### isPos
```clj context=spec fn=isPos
(pos? num)
```
```txt context=desc fn=isPos
Returns true if num is greater than zero, else false
```
```js context=core fn=isPos
var isPos = (x) => x > 0;
```
```js context=test fn=isPos
isPos(-1); // false
```

### isNeg
```clj context=spec fn=isNeg
(neg? num)
```
```txt context=desc fn=isNeg
Returns true if num is less than zero, else false
```
```js context=core fn=isNeg
var isNeg = (x) => x < 0;
```
```js context=test fn=isNeg
isNeg(-1); // true
```

### isInt
```clj context=spec fn=isInt
(int? x)
```
```txt context=desc fn=isInt
Return true if x is a fixed precision integer
```
```js context=core fn=isInt
var isInt = (x) => Number.isInteger(x);
```
```js context=test fn=isInt
isInt(0.1); // false
```

### isBoolean
```clj context=spec fn=isBoolean
(boolean? x)
```
```txt context=desc fn=isBoolean
Return true if x is a Boolean
```
```js context=core fn=isBoolean
var isBoolean = (x) => typeof x === 'boolean';
```
```js context=test fn=isBoolean
isBoolean(true);
```

### isTrue
```clj context=spec fn=isTrue
(true? x)
```
```txt context=desc fn=isTrue
Returns true if x is the value true, false otherwise.
```
```js context=core fn=isTrue
var isTrue = x => x === true;
```
```js context=test fn=isTrue
isTrue(1); // false
isTrue(true); // true
```

### isFalse
```clj context=spec fn=isFalse
(false? x)
```
```txt context=desc fn=isFalse
Returns true if x is the value false, false otherwise.
```
```js context=core fn=isFalse
var isFalse = x => x === false;
```
```js context=test fn=isFalse
isFalse(false); // true
```

### isInstance
```clj context=spec fn=isInstance
(instance? c x)
```
```txt context=desc fn=isInstance
Evaluates x and tests if it is an instance of the class
  c. Returns true or false
```
```js context=core fn=isInstance
var isInstance = (x, type) => x instanceof type;
```
```js context=test fn=isInstance
isInstance([],Array);  // true
isInstance([], Object); // true

```

### isNil
```clj context=spec fn=isNil
(nil? x)
```
```txt context=desc fn=isNil
Returns true if x is nil, false otherwise.
```
```js context=core fn=isNil
var isNil = (x) => x === null; 
```
```js context=test fn=isNil
isNil(null);
```

### isSome
```clj context=spec fn=isSome
(some? x)
```
```txt context=desc fn=isSome
Returns true if x is not nil, false otherwise.
```
```js context=core fn=isSome
var isSome = x => x !== null;
```
```js context=test fn=isSome
isSome(null); // false
isSome('a'); // true
isSome(1); // true
```


### isFn
```clj context=spec fn=isFn
(fn? x)
```
```txt context=desc fn=isFn
Returns true if x implements Fn, i.e. is an object created via fn.
```
```js context=core fn=isFn
var isFn = (x) => typeof x === 'function';
```
```js context=test fn=isFn
isFn(map); // true
```

### isBlank
```clj context=spec fn=isBlank
(blank? s)
```
```txt context=desc fn=isBlank
True if s is nil, empty, or contains only whitespace.
```
```js context=core fn=isBlank
var isBlank = x => typeof x === 'string' && x.trim() === '';
```
```js context=test fn=isBlank
isBlank(''); // true
```

### isNumber
```clj context=spec fn=isNumber
(number? x)
```
```txt context=desc fn=isNumber
Returns true if x is a Number
```
```js context=core fn=isNumber
var isNumber = value => typeof value === 'number' && !Number.isNaN(value)
```
```js context=test fn=isNumber
isNumber('a'); // false
isNumber(1); // true
```

### isEven
```clj context=spec fn=isEven
(even? n)
```
```txt context=desc fn=isEven
Returns true if n is even, throws an exception if n is not an integer
```
```js context=core fn=isEven
var isEven = (x) =>  x % 2 === 0;
```
```js context=test fn=isEven
isEven(0); // true
isEven(1); // false
isEven(5); // false
```

### isOdd
```clj context=spec fn=isOdd
(odd? n)
```
```txt context=desc fn=isOdd
Returns true if n is odd, throws an exception if n is not an integer
```
```js context=core fn=isOdd
var isOdd= (x) =>  x % 2 !== 0;
```
```js context=test fn=isOdd
isOdd(0); // false
isOdd(1); // true
isOdd(5); // true
```

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

### isVector (isArray)
```clj context=spec fn=isVector alias=isArray
(vector? x)
```
```txt context=desc fn=isVector alias=isArray
Return true if x implements IPersistentVector
```
```js context=core fn=isVector alias=isArray
var isVector =(value) =>  Array.isArray(value);
var isArray = isVector;
```
```js context=test fn=isVector alias=isArray
isVector(1); // false
isArray(1); // false
isVector([]); // true
isVector({}); // false
```

### isMap (isObject)
aka isObject
```clj context=spec fn=isMap alias=isObject
(map? x)
```
```txt context=desc fn=isMap alias=isObject
Return true if x implements IPersistentMap
```
```js context=core fn=isMap alias=isObject
var isMap = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
var isObject = isMap;
```
```js context=test fn=isMap alias=isObject
isMap({}); // => true
isMap([]); //=> false
isObject({})
```

### isEmpty 
```clj context=spec fn=isEmpty
(empty? coll)
```
```txt context=desc fn=isEmpty
Returns true if coll has no items - same as (not (seq coll)).
Please use the idiom (seq x) rather than (not (empty? x))
```
```js context=core fn=isEmpty
var isEmpty = (coll) => {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
}
```
```js context=test fn=isEmpty
isEmpty([]); // true
isEmpty({}) // true
```

### not
```clj context=spec fn=not
(not x)
```
```txt context=desc fn=not
Returns true if x is logical false, false otherwise.
```
```js context=core fn=not
var not = (x) => !x;
```
```js context=test fn=not
not(true); // false
not(false); true
not(isEmpty({})); // false
```

### isContains
```clj context=spec fn=isContains
(contains? coll key)
```
```txt context=desc fn=isContains
Returns true if key is present in the given collection, otherwise
returns false.  Note that for numerically indexed collections like
vectors and Java arrays, this tests if the numeric key is within the
range of indexes. 'contains?' operates constant or logarithmic time;
it will not perform a linear search for a value.  See also 'some'.
```
```js context=core fn=isContains
var isContains = (...args)=>{
  let [coll, key] = args;
  if(args.length === 1) return (keyN) => isContains(coll, keyN);
  if (coll instanceof Map || coll instanceof Set) {
    return coll.has(key);
  } else if (typeof coll === "object"){
    if(Array.isArray(coll)){
      return coll.includes(key);
    }else{
      return Object.prototype.hasOwnProperty.call(coll, key);
    }
  } else if (typeof coll === "string") {
    return coll.includes(key);
  } else {
    return false;
  }
};
```
```js context=test fn=isContains
isContains([1,2,3,4], 2); // true
isContains({a:1, b:2}, "b"); // true
isContains('foo', 'o'); // true
```

### isIncludes
```clj context=spec fn=isIncludes
(includes? s substr)
```
```txt context=desc fn=isIncludes
True if s includes substr.
```
```js context=core fn=isIncludes
var isIncludes = (s, substr) => {
  if(!substr) return (substr) => isIncludes(s, substr);
  return s.includes(substr)
}
```
```js context=test fn=isIncludes
isIncludes('aziz zaeny', 'zaeny'); // true
```



### threadf
```clj context=spec fn=threadf
(-> x & forms)
```
```txt context=desc fn=threadf
Threads the expr through the forms. Inserts x as the
second item in the first form, making a list of it if it is not a
list already. If there are more forms, inserts the first form as the
second item in second form, etc.
```
```js context=core fn=threadf deps=partial
var threadf = (val, ...forms)=>{
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){      
      let fns = partial(fn, ...rest);
      return fns(acc);
    }else{
      return fn(acc);
    }
  }, val);
}
```
```js context=test fn=threadf
var associative = [{id:0}, [assoc, 'name', 'azizzaeny'], [assoc, 'id', '1']];
threadf(...associative); //=> { id:'1', name: 'azizzaeny' }
threadf('a b c d', [replace, 'a', 'x'], [split, ' ']); // [ 'x', 'b', 'c', 'd' ]
```


### threadl
```clj context=spec fn=threadl
(->> x & forms)
```
```txt context=desc fn=threadl
Threads the expr through the forms. Inserts x as the
last item in the first form, making a list of it if it is not a
list already. If there are more forms, inserts the first form as the
last item in second form, etc.
```
```js context=core fn=threadl deps=partialRight
var threadl = (val, ...forms) => {
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){
      let fns = partialRight(fn, ...rest);
      return fns(acc);      
    }else{
      return fn(acc);      
    }
  }, val);
}
```
```js context=test fn=threadl
threadl([11], [map, (x) => x * 7]); // [77]
threadl(range(10), [map, (x) => x * 2], [filter, isEven], [take, 5]); //[ 0, 2, 4, 6, 8 ]
```

### cond
```clj context=spec fn=cond
(cond & clauses)
```
```txt context=desc fn=cond
Takes a binary predicate, an expression, and a set of clauses. Each clause can take the form of either: test-expr result-expr test-expr :>> result-fn Note :>> is an ordinary keyword. For each clause, (pred test-expr expr) is evaluated. If it returns logical true, the clause is a matc...
```
```js context=core fn=cond
var cond = (...clauses) => {
  return clauses.reduce((acc, [condition, result]) => {
    return acc === undefined && (condition === true || Boolean(condition)) ? result : acc;
  }, undefined);
};
```
```js context=test fn=cond
cond(
  [false, "never reached"],
  [true, "this will be returned"],
  [true, "not evaluated"]
); // "this will be returned"

var checkNumber = (n) => cond(
  [n < 0, "negative"],
  [n > 0, "positive"],
  [true, "zero"] // Fallback, acts like :else
);
checkNumber(-5); // negative
checkNumber(10); // positive
checkNumber(0);  // zero
```

### condp
```clj context=spec fn=condp
(condp pred expr & clauses)
```
```txt context=desc fn=condp
Takes a binary predicate, an expression, and a set of clauses.
Each clause can take the form of either:
 test-expr result-expr
 test-expr :>> result-fn
 Note :>> is an ordinary keyword.
 For each clause, (pred test-expr expr) is evaluated. If it returns...
```
```js context=core fn=condp
var condp = (pred, expr, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    let value = clauses[i];
    let result = clauses[i + 1];
    if (pred(expr, value)) { return result; }
  }
  let fallback = clauses[clauses.length - 1];
  return typeof fallback === 'function' ? fallback(expr) : fallback;
};
```
```js context=test fn=condp
// condp, f, testvalue, ...clauses
var value = 3;
condp(
  (a, b) => a === b,  // predicate (like `=`)
  value,              // expression to test
  1, "one",           // condition-result pairs
  2, "two",
  3, "three",
  (v) => `unexpected value, "${v}"` // fallback function
); // three

```
### condtf
```clj context=spec fn=condtf
(cond-> expr & clauses)
```
```txt context=desc fn=condtf
Takes an expression and a set of test/form pairs. Threads expr (via ->)
through each form for which the corresponding test
expression is true. Note that, unlike cond branching, cond-> threading does
not short circuit after the first true test expression.
```
```js context=core fn=condtf
var condtf = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      return fn(acc, ...args);  // Thread the value as the first argument
    }
    return acc;  // Skip if the condition is false
  }, val);
};
```
```js context=test fn=condtf
condtf(
  1,                       // Start with 1
  [true, (x) => x + 1],     // Since true, inc(1) => 2
  [false, (x) => x * 42],   // Condition is false, skip this step
  [(2 === 2), (x) => x * 3] // Condition is true, so (* 2 3) => 6
); // 6
```

### condtl
```clj context=spec fn=condtl
(cond->> expr & clauses)
```
```txt context=desc fn=condtl
Takes an expression and a set of test/form pairs. Threads expr (via ->)
through each form for which the corresponding test
expression is true. Note that, unlike cond branching, cond-> threading does
not short circuit after the first true test expression.
```
```js context=core fn=condtl deps=partialRight
var condtl = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      let fns = partialRight(fn, ...args);
      return fns(acc);  // Thread the value as the last argument
    }
    return acc;  // Skip if condition is false
  }, val);
};
```
```js context=test fn=condtl
var inc = (n) => n + 1;
var mult = (n, factor) => n * factor;
var fact = (n, factor) => [n, factor];

condtl(
  1,              // Starting value
  [true, inc],    // Condition true, so inc(1) => 2
  [false, mult, 42],  // Condition false, so this is skipped
  [true, fact, 3] // Condition true, so mult(2, 3) => 6
); // [3, 2]

condtf(
  1,              // Starting value
  [true, inc],    // Condition true, so inc(1) => 2
  [false, mult, 42],  // Condition false, so this is skipped
  [true, fact, 3] // Condition true, so mult(2, 3) => 6
); // [2, 3]

```

### when
```clj context=spec fn=when
(when test & body)
```
```txt context=desc fn=when
Evaluates test. If logical true, evaluates body in an implicit do.
```
```js context=core fn=when
var when = (test, ...body) => {
  if (test) body.forEach(fn => fn());
};
```
```js context=test fn=when
when(true, 
  () => console.log("Condition is true!"),
  () => console.log("Another true case!")); // Both messages will print
when(false, () => console.log("Will not print")); // No output
```

### whenNot 
```clj context=spec fn=whenNot 
(when-not test & body)
```
```txt context=desc fn=whenNot 
Evaluates test. If logical false, evaluates body in an implicit do.
```
```js context=core fn=whenNot 
var whenNot = (test, ...body) => {
  if (!test) { body.forEach(fn => fn()); }
};
```
```js context=test fn=whenNot 
whenNot(false, 
  () => console.log("Condition is false!")); // Output: "Condition is false!"
```

### iff
```clj context=spec fn=iff
(if & body)
```
```txt context=desc fn=iff
evalautes test
```
```js context=core fn=iff
var iff = (test, thenFn, elseFn = () => {}) => {
  return test ? thenFn() : elseFn();
};
```
```js context=test fn=iff
iff(true, 
  () => console.log("True branch"),
  () => console.log("False branch")); // "True branch"
```

### ifNot
```clj context=spec fn=ifNot
(if-not test then)(if-not test then else)
```
```txt context=desc fn=ifNot
Evaluates test. If logical false, evaluates and returns then expr, otherwise else expr, if supplied, else nil.
```
```js context=core fn=ifNot
var ifNot = (test, thenFn, elseFn = () => {}) => {
  if (!test) {
    return thenFn();
  } else {
    return elseFn();
  }
};
```
```js context=test fn=ifNot
ifNot(false, 
  () => "Condition is false!", 
  () => "Condition is true!"); // "Condition is false!"
```

### casef
```clj context=spec fn=casef
(case e & clauses)
```
```txt context=desc fn=casef
Takes an expression, and a set of clauses.
 Each clause can take the form of either:
 test-constant result-expr
 (test-constant1 ... test-constantN)  result-expr
 The test-constants are not evaluated. They must be compile-time
literals, and need not be quoted.  If the expression is equal to a
test-constant, the corresponding result-expr is returned. A single
default expression can follow the clauses, and its value will be
returned if no clause matches. If no default expression is provided
and no clause matches, an IllegalArgumentException is thrown.
```
```js context=core fn=casef
var casef = (e, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    if (clauses[i] === e) {
      return clauses[i + 1];
    }
  }
  return clauses[clauses.length - 1]; // Default case
};
```
```js context=test fn=casef
var value = 3
casef(value,
  1, "one",
  2, "two",
  3, "three",
      "default"); // 3
```


### add 
```clj context=spec fn=add
(+')(+' x)(+' x y)(+' x y & more)
```
```txt context=desc fn=add
Returns the sum of nums. (+') returns 0. Supports arbitrary precision. See also: +
```
```js context=core fn=add
var add = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a + b;
  if(args.length === 2) return a + b;
  return args.reduce((sum, num) => sum + num, 0);
}
```
```js context=test fn=add
add(1,2); // 3
add(1,2,3,4); // 10;
```

### subtract
```clj context=spec fn=subtract
(-' x)(-' x y)(-' x y & more)
```
```txt context=desc fn=subtract
If no ys are supplied, returns the negation of x, else subtracts the ys from x and returns the result. Supports arbitrary precision
```
```js context=core fn=subtract
var subtract = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a - b;
  if(args.length === 2) return a - b;
  return args.reduce((sum, num) => sum - num);
}
```
```js context=test fn=subtract
subtract(10,-2); // 12
subtract(10, 2, 2, 2); // 4
```

### multiply
```clj context=spec fn=multiply
(*)(* x)(* x y)(* x y & more)
```
```txt context=desc fn=multiply
Returns the product of nums. (*) returns 1. Does not auto-promote
longs, will throw on overflow. See also: *
```
```js context=core fn=multiply
var multiply = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a * b;
  if(args.length === 2) return a * b;
  return args.reduce((acc, n) => acc * n);
}
```
```js context=test fn=multiply
multiply(1, 10); // 10
multiply(1, 2, 3); // 6
```

### divide
```clj context=spec fn=divide
(/ x)(/ x y)(/ x y & more)
```
```txt context=desc fn=divide
If no denominators are supplied, returns 1/numerator,
else returns numerator divided by all of the denominators.
```
```js context=core fn=divide
var divide = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a / b;
  if(args.length === 2) return a / b;
  return args.reduce((acc, n) => acc / n);
}
```
```js context=test fn=divide
divide(100, 10); //10
divide(100, 10, 2); //5
```

### quot
```clj context=spec fn=quot
(quot num div)
```
```txt context=desc fn=quot
quot[ient] of dividing numerator by denominator.
```
```js context=core fn=quot
var quot = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.floor(a / b);
  return Math.floor(a / b);
}
```
```js context=test fn=quot
quot(100, 10); // 10
quot(10, 3); // 3
```

### mod
```clj context=spec fn=mod
(mod num div)
```
```txt context=desc fn=mod
Modulus of num and div. Truncates toward negative infinity.
```
```js context=core fn=mod
var mod = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a % b;
  return a % b;
}
```
```js context=test fn=mod
mod(10, 2); // 0;
```

### rem
```clj context=spec fn=rem
(rem num div)
```
```txt context=desc fn=rem
remainder of dividing numerator by denominator.
```
```js context=core fn=rem
var rem = (...args) => {
  let [a, b] = args;
  if (args.length === 1) return (b) => ((a % b) + b) % b;
  return ((a % b) + b) % b;
}
```
```js context=test fn=rem
rem(100, 20); //0
rem(10, 9); //1
rem(2, 2); //0
```

### inc
```clj context=spec fn=inc
(inc x)
```
```txt context=desc fn=inc
Returns a number one greater than num. Does not auto-promote
longs, will throw on overflow. See also: inc'
```
```js context=core fn=inc
var inc = num => num + 1;
```
```js context=test fn=inc
inc(1);
```

### dec
```clj context=spec fn=dec
(dec x)
```
```txt context=desc fn=dec
Returns a number one less than num. Does not auto-promote
longs, will throw on overflow. See also: dec'
```
```js context=core fn=dec
var dec = num => num - 1;
```
```js context=test fn=dec
dec(10); //9
```

### max
```clj context=spec fn=max
(max x)(max x y)(max x y & more)
```
```txt context=desc fn=max
Returns the greatest of the nums.
```
```js context=core fn=max
var max = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.max(a, b);  
  if(args.length === 2) return Math.max(a, b);
  return args.reduce((acc, val) => Math.max(acc, val))
}
```
```js context=test fn=max
max(100, 10); // 100
max(0, 100, 1000, 90); // 1000
```

### min
```clj context=spec fn=min
(min x)(min x y)(min x y & more)
```
```txt context=desc fn=min
Returns the least of the nums.
```
```js context=core fn=min
var min = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.min(a, b);
  if(args.length === 2) return Math.min(a, b);
  return args.reduce((acc, val) => Math.min(acc, val));
}
```
```js context=test fn=min
min(100, 1); //1
min(100, 1, 0, -1); // -1
```

### toInt
```clj context=spec fn=toInt
(int x)
```
```txt context=desc fn=toInt
Coerce to int
```
```js context=core fn=toInt
var toInt = (num) => parseInt(num.toString());
```
```js context=test fn=toInt
toInt(9.12);
```

### subs
```clj context=spec fn=subs
(subs s start)(subs s start end)
```
```txt context=desc fn=subs
Returns the substring of s beginning at start inclusive, and ending
at end (defaults to length of string), exclusive.
```
```js context=core fn=subs
var subs = (...args) => {
  let [str, start, end] = args;
  if(args.length === 1) return (start, end) => str.substring(start, end);
  return str.substring(start, end);
}
```
```js context=test fn=subs
subs("foo", 0, 2); //fo
subs('My name is Aziz', 8); // is Aziz
```

### replace 
```clj context=spec fn=replace
(replace s match replacement)
```
```txt context=desc fn=replace
Given a map of replacement pairs and a vector/collection, returns a vector/seq with any elements = a key in smap replaced with the corresponding val in smap. Returns a transducer when no collection is provided.
```
```js context=core fn=replace
var replace = (...args) =>{
  let [s, match, replacement] = args;
  if(args.length === 1) return (match, replacement) => s.replace(match, replacement);
  return s.replace(new RegExp(match, "g"), replacement);
}
```
```js context=test fn=replace
replace("hello world", "o", "a"); // "hella warld"
```

### replaceFirst
```clj context=spec fn=replaceFirst
(replace-first s match replacement)
```
```txt context=desc fn=replaceFirst
Replaces the first instance of match with replacement in s.
  match/replacement can be:
  char / char
  string / string
  pattern / (string or function of match).
  See also replace.
  The replacement is literal (i.e. none of its characters are treated
  specially) for all cases above except pattern / string.
  For pattern / string, $1, $2, etc. in the replacement string are
 substituted with the string that matched the corresponding
 parenthesized group in the pattern. 
```
```js context=core fn=replaceFirst
var replaceFirst = (...args) => {
  let [str, pattern, replacement] = args;
  if(args.length === 1) return (pattern, replacement) => str.replace(pattern, replacement);
  return str.replace(pattern, replacement);
}
```
```js context=test fn=replaceFirst
replaceFirst("hello world", "o", "a"); // "hella world"
```

### join
```clj context=spec fn=join
(join coll)(join separator coll)
```
```txt context=desc fn=join
Returns a string of all elements in coll, as returned by (seq coll), separated by an optional separator.
```
```js context=core fn=join
var join =(...args) => {
  let [arr, separator] = args;
  if(args.length === 1) return (separator) => arr.join(separator);
  return arr.join(separator);
}
```
```js context=test fn=join
join(["hello", "world"], " "); // "hello world"
```

### escape
```clj context=spec fn=escape
(escape s cmap)
```
```txt context=desc fn=escape
Return a new string, using cmap to escape each character ch
 from s as follows: 
 If (cmap ch) is nil, append ch to the new string.
 If (cmap ch) is non-nil, append (str (cmap ch)) instead.
```
```js context=core fn=escape
var escape = (str) =>  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
```
```js context=test fn=escape
escape("hello.world"); // "hello\.world"
```

### reSeq

### rePattern
```clj context=spec fn=rePattern
(re-pattern s)
```
```txt context=desc fn=rePattern
Returns an instance of java.util.regex.Pattern, for use, e.g. in
re-matcher.
```
```js context=core fn=rePattern
var rePattern = (pattern) =>  new RegExp(pattern);
```
```js context=test fn=rePattern
rePattern("hello.*"); // /hello.*/
```

### reMatches
```clj context=spec fn=reMatches
(re-matches re s)
```
```txt context=desc fn=reMatches
Returns the match, if any, of string to pattern, using
java.util.regex.Matcher.matches().  Uses re-groups to return the
groups.
```
```js context=core fn=reMatches
var reMatches = (...args) => {
  let [str, pattern] = args;
  if(args.length === 1) return (pattern) => reMatches(str, pattern);
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;
  while ((match = regex.exec(str)) !== null) { matches.push(match[0]); }
  return matches;
}
```
```js context=test fn=reMatches
reMatches("hello world", "l+"); // ["ll", 'l']
```

### reMatcher

### capitalize
```clj context=spec fn=capitalize
(capitalize s)
```
```txt context=desc fn=capitalize
Converts first character of the string to upper-case, all other
characters to lower-case.
```
```js context=core fn=capitalize
var capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```
```js context=test fn=capitalize
capitalize("hello world"); // "Hello world"
```

### lowerCase
```clj context=spec fn=lowerCase
(lower-case s)
```
```txt context=desc fn=lowerCase
Converts string to all lower-case.
```
```js context=core fn=lowerCase
var lowerCase = (str) => {
  return str.toLowerCase();
}
```
```js context=test fn=lowerCase
lowerCase("HELLO WORLD"); // "hello world"
```

### upperCase
```clj context=spec fn=upperCase
(upper-case s)
```
```txt context=desc fn=upperCase
Converts string to all upper-case.
```
```js context=core fn=upperCase
var upperCase = (str) => {
  return str.toUpperCase();
}
```
```js context=test fn=upperCase
upperCase("hello world"); // "HELLO WORLD"
```

### trim
```clj context=spec fn=trim
(trim s)
```
```txt context=desc fn=trim
Removes whitespace from both ends of string.
```
```js context=core fn=trim
var trim = (str) => {
  return str.trim();
}
```
```js context=test fn=trim
trim(' aziz '); // 'aziz'
```

### trimNewline
```clj context=spec fn=trimNewline
(trim-newline s)
```
```txt context=desc fn=trimNewline
Removes all trailing newline \n or return \r characters from
string.  Similar to Perl's chomp.
```
```js context=core fn=trimNewline
var trimNewline = (str) => {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, '');
}
```
```js context=test fn=trimNewline
trimNewline('\nhello\nworld\n')
```

### triml
```clj context=spec fn=triml
(triml s)
```
```txt context=desc fn=triml
Removes whitespace from the left side of string.
```
```js context=core fn=triml
var triml =(str) => {
  return str.replace(/^\s+/, '');
}
```
```js context=test fn=triml
triml('\nfoo'); // 'foo'
```

### trimr
```clj context=spec fn=trimr
(trimr s)
```
```txt context=desc fn=trimr
Removes whitespace from the right side of string.
```
```js context=core fn=trimr
var trimr = (str) => {
  return str.replace(/\s+$/, '');
}
```
```js context=test fn=trimr
trimr('foo\n');
```

### char
```clj context=spec fn=char
(char x)
```
```txt context=desc fn=char
Coerce to char
```
```js context=core fn=char
var char = (n) => {
  return String.fromCharCode(n);
}
```
```js context=test fn=char
char(56); // '8'
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


### disj
```clj context=spec fn=disj
(disj set)(disj set key)(disj set key & ks)
```
```txt context=desc fn=disj
disj[oin]. Returns a new set of the same (hashed/sorted) type, that
        does not contain key(s).
```
```js context=core fn=disj
// todo: fix disj
var disj = (...[st, k, ...ks]) =>{
  if(!k) return (k, ...ks) => disj(st, k, ...ks);
  return st.filter(item => item !== k)
}
```
```js context=test fn=disj
disj([1,2, 3], 1) //=>  [2,3]
```


### concat
```clj context=spec fn=concat
(concat)(concat x)(concat x y)(concat x y & zs)
```
```txt context=desc fn=concat
Returns a lazy seq representing the concatenation of the elements in the supplied colls.
```
```js context=core fn=concat
var concat = (...[x,...zs]) => {
  if(!zs) return (...zs) => concat(x, ...zs);
  return x.concat(...zs);
}
```
```js context=test fn=concat
concat([1], [2], [3], [4]); //[1,2,3,4]
```

### first
```clj context=spec fn=first
(first coll)
```
```txt context=desc fn=first
Returns the first item in the collection. Calls seq on its
        argument. If coll is nil, returns nil.
```
```js context=core fn=first
var first = (seq) => seq[0];
```
```js context=test fn=first
first([1,2]) //=> 1
```

### ffirst
```clj context=spec fn=ffirst
(ffirst x)
```
```txt context=desc fn=ffirst
Same as (first (first x))
```
```js context=core fn=ffirst
var ffirst = (seq) => first(seq[0])
```
```js context=test fn=ffirst
ffirst([[0, 1], [1,2]]) //=> 0
```

### second
```clj context=spec fn=second
(second x)
```
```txt context=desc fn=second
Same as (first (next x))
```
```js context=core fn=second
var second = ([_, x]) => x;
```
```js context=test fn=second
second([1, 2]); // => 2
```

### last
```clj context=spec fn=last
(last coll)
```
```txt context=desc fn=last
Return the last item in coll, in linear time
```
```js context=core fn=last
var last = (arr) => arr[arr.length - 1];
```
```js context=test fn=last
last([0,1,2,3,4]) // => 4
```

### next
```clj context=spec fn=next
(next coll)
```
```txt context=desc fn=next
Returns a seq of the items after the first. Calls seq on its
        argument.  If there are no more items, returns nil.
```
```js context=core fn=next
var next = ([_, ...rest]) => { return rest; }
```
```js context=test fn=next
next([1,2,3,4]) // [2,3,4]
next(next([1,2,3,4])); //[3,4]
next(next(next([1,2,3,4]))); //[4]
next(next(next(next([1,2,3,4])))); //[]
```
### nfirst
```clj context=spec fn=nfirst
(nfirst x)
```
```txt context=desc fn=nfirst
Same as (next (first x))
```
```js context=core fn=nfirst
var nfirst = (x) =>  next(first(x));
```
```js context=test fn=nfirst
nfirst([[1,2,3], [4,6,7]]) //=> [2,3]
```

### nnext
```clj context=spec fn=nnext
(nnext x)
```
```txt context=desc fn=nnext
Same as (next (next x))
```
```js context=core fn=nnext
var nnext = (x) => next(next(x));
```
```js context=test fn=nnext
nnext([1,2,3,4]) //=> [3,4]
```

### fnext
```clj context=spec fn=fnext
(fnext x)
```
```txt context=desc fn=fnext
Same as (first (next x))
```
```js context=core fn=fnext
var fnext = (x) => first(next(x));
```
```js context=test fn=fnext
fnext([[1,2,3], [4,5,6]]) //=> [4,5,6];
```


### take 
```clj context=spec fn=take
(take n)(take n coll)
```
```txt context=desc fn=take
Returns a lazy sequence of the first n items in coll, or all items if
    there are fewer than n.  Returns a stateful transducer when
        no collection is provided.
```
```js context=core fn=take
var take = (...[n, coll]) => {
  if(!coll) return (coll) => take(n, coll);
  return coll.slice(0, n);
}
```
```js context=test fn=take
take(2, [1,2,3,4,5,6,7,8]) //=> [1,2]
take(4, [1,2,3,4,5,6,7,8]) //=> [1,2,3,4]
```

### takeNth
```clj context=spec fn=takeNth
(take-nth n)(take-nth n coll)
```
```txt context=desc fn=takeNth
Returns a lazy seq of every nth item in coll.  Returns a stateful
        transducer when no collection is provided.
```
```js context=core fn=takeNth
// todo: check takeNth
var takeNth = (...[n, coll]) => {
  if(!coll) return (coll) => takeNth(n, coll);
  return coll.filter((_, i) => i % n === 0);
}
```
```js context=test fn=takeNth
takeNth(2,[1,2,3,4,5,6,7,8]) //=> [1,3,5,7]
takeNth(3, [1,2,3,4,5,6,7,8]) //=> [1,4,7]
```

### takeLast
```clj context=spec fn=takeLast
(take-last n coll)
```
```txt context=desc fn=takeLast
Returns a seq of the last n items in coll.  Depending on the type
        of coll may be no better than linear time.  For vectors, see also subvec.
```
```js context=core fn=takeLast
var takeLast= (...[n, coll])=>{  
  if(!coll) return (coll) => takeLast(n, arr1=coll);
  return coll.slice(-n);  
}
```
```js context=test fn=takeLast
takeLast(2, [1,2,3,4,5,6,7]) // [6,7]
takeLast(3)([1,2,3,4,5,6]) // [4,5,6]
```


### takeWhile
```clj context=spec fn=takeWhile
(take-while pred)(take-while pred coll)
```
```txt context=desc fn=takeWhile
Returns a lazy sequence of successive items from coll while
(pred item) returns logical true. pred must be free of side-effects.
Returns a transducer when no collection is provided.
```
```js context=core fn=takeWhile
var takeWhile = (...[pred, coll]) =>{
  if (!coll) return coll => takeWhile(pred, coll);  
  let index = coll.findIndex(val => !pred(val))
  return index === -1 ? coll : coll.slice(0, index);
}
```
```js context=test fn=takeWhile
takeWhile((n)=> n < 5, [1,2,3,4,5,6,7,8]); // [1,2,3,4]
```


### takeNth
```clj context=spec fn=takeNth
(take-nth n)(take-nth n coll)
```
```txt context=desc fn=takeNth
Returns a lazy seq of every nth item in coll.  Returns a stateful
transducer when no collection is provided.
```
```js context=core fn=takeNth
var takeNth = (...[n, coll]) => {
  if (!coll) return coll => takeNth(n, coll)
  return coll.filter((_, i) => i % n === 0);
}
```
```js context=test fn=takeNth
takeNth(3, [1,2,3,4,5,6,7,8]) //[1,4,7]
```

### nth
```clj context=spec fn=rest
(nth coll index)(nth coll index not-found)
```
```txt context=desc fn=rest
Returns the value at the index. get returns nil if index out of
bounds, nth throws an exception unless not-found is supplied.  nth
also works for strings, Java arrays, regex Matchers and Lists, and,
in O(n) time, for sequences.
```
```js context=core fn=rest
var nth = (...[coll, index]) =>{
  if(!index) return (index) => nth(coll, index);
  return coll[index];
}
```
```js context=test fn=rest
nth([1,2,3,4], 2) //=> 3
nth([1,2,3,4])(2); //=> 3
```

### nthrest
```clj context=spec fn=nthrest
(nthrest coll n)
```
```txt context=desc fn=nthrest
Returns the nth rest of coll, coll when n is 0.
```
```js context=core fn=nthrest
var nthrest = (...[coll, n]) =>{
  if(!n) return (n) => nthrest(coll, n);
   return coll.filter((_, i) => i >= n)
}
```
```js context=test fn=nthrest
nthrest([1,2,3,4,5,6], 2) // [3,4,5,6]
```


### drop
```clj context=spec fn=drop
(drop n)(drop n coll)
```
```txt context=desc fn=drop
Returns a lazy sequence of all but the first n items in coll.
Returns a stateful transducer when no collection is provided.
```
```js context=core fn=drop
var drop = (...[n, coll]) => {
  if(!coll) return (coll) => drop(n, coll);
  return coll.slice(n);
}
```
```js context=test fn=drop
drop(2, [1,2,3,4,5]) //=> [3,4,5]
```

### dropLast
```clj context=spec fn=dropLast
(drop-last coll)(drop-last n coll)
```
```txt context=desc fn=dropLast
Return a lazy sequence of all but the last n (default 1) items in coll
```
```js context=core fn=dropLast
var dropLast = (coll) => { return coll.slice(0, -1); }
```
```js context=test fn=dropLast
dropLast([1,2,3,4]); // => [1,2,3]
```

### dropWhile
```clj context=spec fn=dropWhile
(drop-while pred)(drop-while pred coll)
```
```txt context=desc fn=dropWhile
Returns a lazy sequence of the items in coll starting from the
first item for which (pred item) returns logical false.  Returns a
stateful transducer when no collection is provided.
```
```js context=core fn=dropWhile
var dropWhile = (pred, coll) => {
  let index = 0;
  while (index < coll.length && pred(coll[index])) { index++;  }
  return coll.slice(index);
};
```
```js context=test fn=dropWhile
var isEven = num => num % 2 === 0;
dropWhile(isEven, [2, 4, 6, 7, 8]); // [7,8]
dropWhile(isEven, [2, 4, 6]); //[]
dropWhile(num => num < 5, [1, 2, 3, 6, 7]); // [6,7]
```


### peek 
```clj context=spec fn=peek
(peek coll)
```
```txt context=desc fn=peek
For a list or queue, same as first, for a vector, same as, but much
more efficient than, last. If the collection is empty, returns nil.
```
```js context=core fn=peek
var peek = (coll) => coll[coll.length - 1];
```
```js context=test fn=peek
peek([1,2,3,4])  //=> 4
```

### rest
```clj context=spec fn=rest
(rest coll)
```
```txt context=desc fn=rest
Returns a possibly empty seq of the items after the first. Calls seq on its
argument.
```
```js context=core fn=rest
var rest = (coll) => coll.slice(1);
```
```js context=test fn=rest
rest([1,2,3]) //=> [2,3]
```

### pop
```clj context=spec fn=pop
(pop coll)
```
```txt context=desc fn=pop
For a list or queue, returns a new list/queue without the first
item, for a vector, returns a new vector without the last item. If
the collection is empty, throws an exception.  Note - not the same
as next/butlast.
```
```js context=core fn=pop
var pop = ([f,...coll]) => coll
```
```js context=test fn=pop
pop([1,2,3]) // => [1,2]
pop(['a', 'b', 'c']); //=> ['b', 'c']
```

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
```js context=core fn=assocIn deps=assoc
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
```js context=core fn=updateIn deps=update
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

### seq
```clj context=spec fn=seq
(seq coll)
```
```txt context=desc fn=seq
Returns a seq on the collection. If the collection is
  empty, returns nil.  (seq nil) returns nil. seq also works on
  Strings, native Java arrays (of reference types) and any objects
  that implement Iterable. Note that seqs cache values, thus seq
  should not be used on any Iterable whose iterator repeatedly
  returns the same mutable object.
```
```js context=core fn=seq
var seq = (coll) =>{
  if(Array.isArray(coll)) return coll;
  if(typeof coll === 'object') return Object.entries(coll);
  if(typeof coll === 'string') return Array.from(coll);
  return coll;
}
```
```js context=test fn=seq
seq({a:1, b:2}) //=> [["a", 1], ["b", 2]]
seq('aziz') //=> ['a', 'z','i', 'z']

```

### vec
```clj context=spec fn=vec
(vec coll)
```
```txt context=desc fn=vec
Creates a new vector containing the contents of coll. Java arrays
will be aliased and should not be modified.
```
```js context=core fn=vec
var vec = (coll) =>{
  if (!coll) return [];
  if (Array.isArray(coll)) return coll;
  if (typeof coll === 'string') return coll.split('');
  if (typeof coll[Symbol.iterator] === 'function') return Array.from(coll);
  return Object.values(coll);
}
```
```js context=test fn=vec
vec({a: 'b'}); // ['b']
vec('asdff');  // ['a', 's', 'd', 'f','f']
vec([1,2,3,4,5]); //[1,2,3,4,5]
```

### subvec
```clj context=spec fn=subvec
(subvec v start)(subvec v start end)
```
```txt context=desc fn=subvec
Returns a persistent vector of the items in vector from
start (inclusive) to end (exclusive).  If end is not supplied,
defaults to (count vector). This operation is O(1) and very fast, as
the resulting vector shares structure with the original and no
trimming is done.
```
```js context=core fn=subvec
var subvec = (...[v, start, end]) => {
  if(!end) end = v.length;
  if(start < 0 || end < 0) return null;
  return v.slice(start, end);
}
```
```js context=test fn=subvec
subvec([1,2,3], 1); // [2,3]
subvec([1,2,3,4,5,65,76,8], 2, 5); //[ 3, 4, 5 ]
```

### vector
### vectorOf
### vectorZip

### repeat
```clj context=spec fn=repeat
(repeat x)(repeat n x)
```
```txt context=desc fn=repeat
Returns a lazy (infinite!, or length n if supplied) sequence of xs.
```
```js context=core fn=repeat

var repeat = (...[n, x]) =>{
  if(!x) return (x) => repeat(n, x);
  return Array(n).fill(x);
}
```
```js context=test fn=repeat
repeat(5)(2); // [2,2,2,2,2]
repeat(5, 2); // [2,2,2,2,2]
```


### repeatedly
```clj context=spec fn=repeatedly
(repeatedly f)(repeatedly n f)
```
```txt context=desc fn=repeatedly
Takes a function of no args, presumably with side effects, and
returns an infinite (or length n if supplied) lazy sequence of calls
to it
```
```js context=core fn=repeatedly
var repeatedly = (...args) => {
  let n, fn;
  if(args.length === 1) (fn = args[0]);
  if(args.length === 2) (n=args[0], fn = args[1]);
  if (n === undefined) {
    return function* () {
      while (true) {
        yield fn();
      }
    };
  } else {
    return Array.from({ length: n }, () => fn());
  }
};

```
```js context=test fn=repeatedly
repeatedly(5, randInt); // [50, 0, 1, 2,3];
repeatedly(randInt)()
```

### range
```clj context=spec fn=range
(range)(range end)(range start end)(range start end step)
```
```txt context=desc fn=range
Returns a lazy seq of nums from start (inclusive) to end (exclusive), by step, where start defaults to 0, step to 1, and end to infinity. When step is equal to 0, returns an infinite sequence of start. When start is equal to end, returns empty list.
```
```js context=core fn=range
// todo: fix args
var range = (...args)  =>{
  let [start, end, step=1] = args
  if (args.length === 1) (end = start, start = 0);
  let result = [];
  for (let i = start; i < end; i += step) { result.push(i);  }
  return result;
}
```
```js context=test fn=range
range(0, 5); //=> [ 0, 1, 2, 3, 4 ]
```

### keep
```clj context=spec fn=keep
(keep f)(keep f coll)
```
```txt context=desc fn=keep
Returns a lazy sequence of the non-nil results of (f item). Note,
this means false return values will be included.  f must be free of
side-effects.  Returns a transducer when no collection is provided.
```
```js context=core fn=keep
var keep = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr)=>{
    let res = f(curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
}
```
```js context=test fn=keep
keep(n => (n % 2 === 0 ) ? n : null, range(0, 10)); // => [ 0, 2, 4, 6, 8 ]
```

### keepIndexed
```clj context=spec fn=keepIndexed
(keep-indexed f)(keep-indexed f coll)
```
```txt context=desc fn=keepIndexed
Returns a lazy sequence of the non-nil results of (f index item). Note,
this means false return values will be included.  f must be free of
side-effects.  Returns a stateful transducer when no collection is
provided.
```
```js context=core fn=keepIndexed
var keepIndexed = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr, i)=>{
    let res = f(i, curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
}
```
```js context=test fn=keepIndexed
keepIndexed((n,i)=> (i % 2 ===0) ? n : null, range(0, 10)); //=> [ 0, 2, 4, 6, 8 ]
```

### split
```clj context=spec fn=split
(split p ch)(split p ch t-buf-or-n f-buf-or-n)
```
```txt context=desc fn=split
Splits string on a regular expression.  Optional argument limit is
the maximum number of parts. Not lazy. Returns vector of the parts.
Trailing empty strings are not returned - pass limit of -1 to return all.
```
```js context=core fn=split
//TODO: fix split reg
var split = (...[p, ch]) => {
  if(!ch) return (ch) => split(p, ch);
  return p.split(ch);
}
```
```js context=test fn=split
split('asdf asdf', ' '); //[ 'asdf', 'asdf' ]
```

### splitAt
```clj context=spec fn=splitAt
(split-at n coll)
```
```txt context=desc fn=splitAt
Returns a vector of [(take n coll) (drop n coll)]
```
```js context=core fn=splitAt
var splitAt = (...[n, coll])=>{
  if(!coll) return (coll) => splitAt(n, coll);
  return [coll.slice(0, n), coll.slice(n)];
}
```
```js context=test fn=splitAt
splitAt(2, [1,2,3,4,5,6]) //[ [ 1, 2 ], [ 3, 4, 5, 6 ] ]
```

### splitWith
```clj context=spec fn=splitWith
(split-with pred coll)
```
```txt context=desc fn=splitWith
Returns a vector of [(take-while pred coll) (drop-while pred coll)]
```
```js context=core fn=splitWith
var splitWith = (pred, coll) => {
  let index = coll.findIndex(element => !pred(element));
  if (index === -1) {
    return [coll, []];
  }
  return [coll.slice(0, index), coll.slice(index)];
};
```
```js context=test fn=splitWith
var isEven = num => num % 2 === 0;
var numbers = [2, 4, 6, 7, 8];
splitWith(isEven, numbers); // [ [ 2, 4, 6 ], [ 7, 8 ] ]
```


### splitLines
```clj context=spec fn=splitLines
(split-lines s)
```
```txt context=desc fn=splitLines
Splits s on \n or \r\n. Trailing empty lines are not returned.
```
```js context=core fn=splitLines
var splitLines =(str) => {
  return str.split("\n");
}
```
```js context=test fn=splitLines
splitLines('hai\nllow');
```

### shuffle
```clj context=spec fn=shuffle
(shuffle coll)
```
```txt context=desc fn=shuffle
Return a random permutation of coll
```
```js context=core fn=shuffle
var shuffle = (coll) => {
  let result = coll.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
```
```js context=test fn=shuffle
shuffle([1,2,3,4,5,6,7,7,8]);
```

### randNth
```clj context=spec fn=randNth
(rand-nth coll)
```
```txt context=desc fn=randNth
Return a random element of the (sequential) collection. Will have
the same performance characteristics as nth for the given
collection.
```
```js context=core fn=randNth
var randNth = (coll) => {
  let i = Math.floor(Math.random() * coll.length);
  return coll[i];
};
```
```js context=test fn=randNth
randNth([1,2,3,4,5,6,7]); // rnd
```

### rand 
```clj context=spec fn=rand 
(rand)(rand n)
```
```txt context=desc fn=rand 
Returns a random floating point number between 0 (inclusive) and n (default 1) (exclusive).
```
```js context=core fn=rand 
var rand = () => Math.random();
```
```js context=test fn=rand 
rand(); // 0.912919809
```

### randInt 
```clj context=spec fn=randInt
(rand-int n)
```
```txt context=desc fn=randInt
Returns a random integer between 0 (inclusive) and n (exclusive).
```
```js context=core fn=randInt
var randInt = (max=100) => {
  return Math.floor(Math.random() * max);
}
```
```js context=test fn=randInt
randInt(); //25
```

### find
```clj context=spec fn=find
(find map key)
```
```txt context=desc fn=find
Returns the map entry for key, or nil if key not present.
```
```js context=core fn=find
var find = (...[map, key]) => {
  if(!key) return (key) => find(map, key);
  return Object.entries(map).find(([k, v])=> k === key);
}
```
```js context=test fn=find
find({a: 1, b:2}, 'a'); // => ['a', 1]
```

### map
```clj context=spec fn=map
(map f)(map f coll)(map f c1 c2)(map f c1 c2 c3)(map f c1 c2 c3 & colls)
```
```txt context=desc fn=map
Returns a lazy sequence consisting of the result of applying f to
the set of first items of each coll, followed by applying f to the
set of second items in each coll, until any one of the colls is
exhausted.  Any remaining items in other colls are ignored. Function
f should accept number-of-colls arguments. Returns a transducer when
no collection is provided.
```
```js context=core fn=map
var map = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map(f);
```
```js context=test fn=map
map(n => n * 2, [12,13,14,15,16]); // => [ 24, 26, 28, 30, 32 ]
```

### mapcat
```clj context=spec fn=mapcat
(mapcat f)(mapcat f & colls)
```
```txt context=desc fn=mapcat
Returns the result of applying concat to the result of applying map
to f and colls.  Thus function f should return a collection. Returns
a transducer when no collections are provided
```
```js context=core fn=mapcat
var mapcat = (...[f, ...coll]) => {
  if(!coll || coll.length === 0) return (...coll) => mapcat(f, ...coll);
  return coll.flat().map(f).reduce((acc, val) => acc.concat(val), [])
}
```
```js context=test fn=mapcat
mapcat(x => [x, x * 2], [1,2,3,4]); // [ 1, 2, 2, 4,  3, 6, 4, 8]
```

### mapIndexed
```clj context=spec fn=mapIndexed
(map-indexed f)(map-indexed f coll)
```
```txt context=desc fn=mapIndexed
Returns a lazy sequence consisting of the result of applying f to 0
and the first item of coll, followed by applying f to 1 and the second
item in coll, etc, until coll is exhausted. Thus function f should
accept 2 arguments, index and item. Returns a stateful transducer when
no collection is provided.
```
```js context=core fn=mapIndexed
var mapIndexed = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map((val, idx)=> f(val, idx));
```
```js context=test fn=mapIndexed
mapIndexed((n, i) => [n, i], [1,2,3,4,5]); //=> [ [ 1, 0 ], [ 2, 1 ], [ 3, 2 ], [ 4, 3 ], [ 5, 4 ] ]
```


### filter
```clj context=spec fn=filter
(filter pred)(filter pred coll)
```
```txt context=desc fn=filter
Returns a lazy sequence of the items in coll for which
(pred item) returns logical true. pred must be free of side-effects.
Returns a transducer when no collection is provided.
```
```js context=core fn=filter
var filter = (...[pred, coll]) => (!coll) ? (coll) => filter(pred, coll) : coll.filter(pred);
```
```js context=test fn=filter
filter(n=> n > 2)([1,2,3,4,5,6]); // => [ 3, 4, 5, 6 ]
```


### remove
```clj context=spec fn=remove
(remove pred)(remove pred coll)
```
```txt context=desc fn=remove
Returns a lazy sequence of the items in coll for which (pred item) returns logical false. pred must be free of side-effects. Returns a transducer when no collection is provided.
```
```js context=core fn=remove
var remove = (...[pred, coll]) => {
  if(!coll) return (coll) => remove(pred, coll);
  return coll.filter(item => !pred(item));
}
```
```js context=test fn=remove
remove((x)=> x % 2 === 0, range(0, 20)); // => [  1,  3,  5,  7,  9,  11, 13, 15, 17, 19]
```

### isEvery
```clj context=spec fn=isEvery
(every? pred coll)
```
```txt context=desc fn=isEvery
Returns true if (pred x) is logical true for every x in coll, else
false.
```
```js context=core fn=isEvery
var isEvery = (...[pred, coll]) =>{
  if(!coll) return (coll) => isEvery(pred, coll);
  return coll.every(pred, coll);
}
```
```js context=test fn=isEvery
isEvery(n => n > 0, [1,2,3,34,5]); //=> true
```

### everyPred 
```clj context=spec fn=everyPred
(every-pred p)(every-pred p1 p2)(every-pred p1 p2 p3)(every-pred p1 p2 p3 & ps)
```
```txt context=desc fn=everyPred
Takes a set of predicates and returns a function f that returns true if all of its
composing predicates return a logical true value against all of its arguments, else it returns
false. Note that f is short-circuiting in that it will stop execution on the first
argument that triggers a logical false result against the original predicate.
```
```js context=core fn=everyPred
var everyPred = (...fns) => {
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (!fns[i](x)) {
        return false;
      }
    }
    return true;
  };
}
```
```js context=test fn=everyPred
var isPos = n => n > 0;
var isEven = n => n % 2 === 0;
everyPred(isPos,isEven)(2); //true 
everyPred(n => n > 0)(1) // true
```

### flatten
```clj context=spec fn=flatten
(flatten x)
```
```txt context=desc fn=flatten
Takes any nested combination of sequential things (lists, vectors,
etc.) and returns their contents as a single, flat lazy sequence.
(flatten nil) returns an empty sequence.
```
```js context=core fn=flatten
var flatten = (x) => x.flat();
```
```js context=test fn=flatten
flatten([1,2,[3,4],[[1,2,3,4]]]); //=> [ 1, 2, 3, 4, [ 1, 2, 3, 4 ] ]
```

### reduce
```clj context=spec fn=reduce
(reduce f coll)(reduce f val coll)
```
```txt context=desc fn=reduce
f should be a function of 2 arguments. If val is not supplied,
returns the result of applying f to the first 2 items in coll, then
applying f to that result and the 3rd item, etc. If coll contains no
items, f must accept no arguments as well, and reduce returns the
result of calling f with no arguments.  If coll has only 1 item, it
is returned and f is not called.  If val is supplied, returns the
result of applying f to val and the first item in coll, then
applying f to that result and the 2nd item, etc. If coll contains no
items, returns val and f is not called.
```
```js context=core fn=reduce
var reduce = (...args) => {
  let [f, val, coll] = args;
  if(args.length === 1) return (coll) => reduce(f, undefined, coll);
  if(args.length === 2) return (coll) => reduce(f, val, coll);
  return coll.reduce(f, val);
}
```
```js context=test fn=reduce
reduce((acc, v) => acc + v, 0, [1,23,4,5,6,77]); // => 116
reduce((acc, v) => merge(acc, v))([{a:1}, {b:2}]); // => {a:1, b:2}
```

### sort
```clj context=spec fn=sort
(sort coll)(sort comp coll)
```
```txt context=desc fn=sort
Returns a sorted sequence of the items in coll. If no comparator is supplied, uses compare. comparator must implement java.util.Comparator. Guaranteed to be stable: equal elements will not be reordered. If coll is a Java array, it will be modified. To avoid this, sort a copy of the array...
```
```js context=core fn=sort
var sort = (...args) => {
  let [arr, comp = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comp);
}
```
```js context=test fn=sort
sort([1,2,3,4,5,6,5,4,1]); // [1,1,2,3,4,4,5,5,6]
```

### sortBy
```clj context=spec fn=sortBy
(sort-by keyfn coll)(sort-by keyfn comp coll)
```
```txt context=desc fn=sortBy
Returns a sorted sequence of the items in coll, where the sort order is determined by comparing (keyfn item). If no comparator is supplied, uses compare. comparator must implement java.util.Comparator. Guaranteed to be stable: equal elements will not be reordered. If coll is a Java array...
```
```js context=core fn=sortBy
// todo: fix keyFn comp
var sortBy=(...args) =>{
  let [fn, coll] = args;
  if (args.length === 1) {
    return coll => [...coll].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...coll].sort((a, b) => fn(a) - fn(b));
  }
}
```
```js context=test fn=sortBy
sortBy((n)=> n.length, ["aaa", "bb", "c"]); // ['c', 'bb', 'aaa']
```

### compare
```clj context=spec fn=compare
(compare x y)
```
```txt context=desc fn=compare
Comparator. Returns a negative number, zero, or a positive number
when x is logically 'less than', 'equal to', or 'greater than'
y.
```
```js context=core fn=compare
var compare = (a , b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}
```
```js context=test fn=compare
compare(1, 2); // => -1
```

### reverse
```clj context=spec fn=reverse
(reverse coll)
```
```txt context=desc fn=reverse
Returns a seq of the items in coll in reverse order. Not lazy.
```
```js context=core fn=reverse
var reverse = (coll) => [...coll].reverse();
```
```js context=test fn=reverse
reverse([1,2,4,6,7,9]); // =>[ 9, 7, 6, 4, 2, 1 ]
```

### interleave
```clj context=spec fn=interleave
(interleave)(interleave c1)(interleave c1 c2)(interleave c1 c2 & colls)
```
```txt context=desc fn=interleave
Returns a lazy seq of the first item in each coll, then the second etc.
```
```js context=core fn=interleave
// TODO: fix multi collection
var interleave = (...args) => {
  let [c1, c2, ...colls] = args;
  if(args.length === 2) return c1.map((v, i) => [v, c2[i]]).flat();
}
```
```js context=test fn=interleave
interleave([1,2,3], ["a", "b","c"]) // []
```

### interpose
```clj context=spec fn=interpose
(interpose sep)(interpose sep coll)
```
```txt context=desc fn=interpose
Returns a lazy seq of the elements of coll separated by sep. Returns a stateful transducer when no collection is provided.
```
```js context=core fn=interpose
var interpose = (...args) => {
  let [sep, coll] = args;
  if (args.length === 1) {
    return coll => coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } else {
    return coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } 
}
```
```js context=test fn=interpose
interpose(",", ["one", "two", "three"]); // => [ 'one', ',', 'two', ',', 'three' ]
```

### distinct
```clj context=spec fn=distinct
(distinct)(distinct coll)
```
```txt context=desc fn=distinct
Returns a lazy sequence of the elements of coll with duplicates removed.
Returns a stateful transducer when no collection is provided.
```
```js context=core fn=distinct
var distinct = (coll) => [...new Set(coll)];
```
```js context=test fn=distinct
distinct([1,2,1,2,4,5,6,6,7,6,8]); // => [1, 2, 4, 5, 6, 7, 8]
```

### groupBy
```clj context=spec fn=groupBy
(group-by f coll)
```
```txt context=desc fn=groupBy
Returns a map of the elements of coll keyed by the result of
f on each element. The value at each key will be a vector of the
corresponding elements, in the order they appeared in coll.
```
```js context=core fn=groupBy
var groupBy = (...[f, coll]) =>{
  if(!coll) return (coll) => groupBy(f, coll);
  return coll.reduce((acc, curr) => {
    let key = f(curr);
    if(!acc[key]) (acc[key]=[]);
    return (acc[key].push(curr), acc);
  }, {});
}
```
```js context=test fn=groupBy
groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]); // { false: [ -1, -9, -2 ], true: [ 2, 3, 4, 5 ] }
groupBy(count,["a","as","asd","aa","asdf","qwer"]);
/*
  {
  '1': [ 'a' ],
  '2': [ 'as', 'aa' ],
  '3': [ 'asd' ],
  '4': [ 'asdf', 'qwer' ]
}*/
```

### frequencies
```clj context=spec fn=frequencies
(frequencies coll)
```
```txt context=desc fn=frequencies
Returns a map from distinct items in coll to the number of times
they appear.
```
```js context=core fn=frequencies
var frequencies = (coll) => {
  let freqMap = new Map();
  for (const el of coll) { freqMap.set(el, (freqMap.get(el) || 0) + 1);  }
  return Object.fromEntries(freqMap);
}
```
```js context=test fn=frequencies
frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]); // { '1': 3, '2': 3, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 2 }
```

### partition
```clj context=spec fn=partition
(partition n coll)(partition n step coll)(partition n step pad coll)
```
```txt context=desc fn=partition
Returns a lazy sequence of lists of n items each, at offsets step
apart. If step is not supplied, defaults to n, i.e. the partitions
do not overlap. If a pad collection is supplied, use its elements as
necessary to complete last partition upto n items. In case there are
not enough padding elements, return a partition with less than n items.
```
```js context=core fn=partition
// todo: multi arity arguments, step, and so on
var partition=(...args) =>{
  let [n, coll] = args;
  if(args.length === 1) return (coll) => partition(n, coll);
  let result = [];
  for (let i = 0; i < coll.length; i += n) { result.push(coll.slice(i, i + n));  }
  return result;
}
```
```js context=test fn=partition
partition(4, [1,2,3,4,5,6,7,8,9]); // => [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9 ] ]
```

### partitionBy
```clj context=spec fn=partitionBy
(partition-by f)(partition-by f coll)
```
```txt context=desc fn=partitionBy
Applies f to each value in coll, splitting it each time f returns a
 new value.  Returns a lazy seq of partitions.  Returns a stateful
 transducer when no collection is provided.
```
```js context=core fn=partitionBy
var partitionBy=(...args)=>{
  let [fn, coll] = args;
  if(args.length === 1){
    return (coll) => partitionBy(fn, coll);
  }
  const result = [];
  let group = [];
  let prevValue;
  for (const elem of coll) {
    const value = fn(elem);
    if (value === prevValue || prevValue === undefined) {
      group.push(elem);
    } else {
      result.push(group);
      group = [elem];
    }
    prevValue = value;
  }
  if (group.length > 0) {
    result.push(group);
  }
  return result;
}
```
```js context=test fn=partitionBy
partitionBy(n => n % 2 !== 0)([1,1,1,1,2,2,2,3,3,3,4,4,5]); // => [ [ 1, 1, 1, 1 ], [ 2, 2, 2 ], [ 3, 3, 3 ], [ 4, 4 ], [ 5 ] ]
```


### partitionAll
```clj context=spec fn=partitionAll
(partition-all n)(partition-all n coll)(partition-all n step coll)
```
```txt context=desc fn=partitionAll
Returns a lazy sequence of lists like partition, but may include
partitions with fewer than n items at the end.  Returns a stateful
transducer when no collection is provided.
```
```js context=core fn=partitionAll
var partitionAll=(...args) =>{
  let [size, arr] = args;
  if(args.length === 1){
    return (coll) => partitionAll(size, coll);
  }
  if (!arr || !arr.length) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
```
```js context=test fn=partitionAll
partitionAll(4, [1,2,3,4,5,6,7,8,9]); // => [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ], [ 9 ] ]
```

### union
```clj context=spec fn=union
(union)(union s1)(union s1 s2)(union s1 s2 & sets)
```
```txt context=desc fn=union
Return a set that is the union of the input sets
```
```js context=core fn=union
// TODO: more args
var union = (...args) => {
  let [s1, s2, ...sets] = args;
  return (args.length == 1) ? (s2, ...sets) => union(s1, s2, ...sets) : Array.from(new Set([...s1, ...s2, ...sets]));
}
```
```js context=test fn=union
union([1,2,3,4,5], [1,2,3,8,9]); // => [ 1, 2, 3, 4, 5, 8, 9 ]
```


### difference
```clj context=spec fn=difference
(difference s1)(difference s1 s2)(difference s1 s2 & sets)
```
```txt context=desc fn=difference
Return a set that is the first set without elements of the remaining sets
```
```js context=core fn=difference
// TODO: more arguments sets
var difference =(...args) => {
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => difference(s1, s2, ...sets);
  return s1.filter((x) => !s2.includes(x)); // TODO: more args
}
```
```js context=test fn=difference
difference([1,2,3,4,5], [0, 3, 5,6]); // [1,2,4]
```

### intersection
```clj context=spec fn=intersection
(intersection s1)(intersection s1 s2)(intersection s1 s2 & sets)
```
```txt context=desc fn=intersection
Return a set that is the intersection of the input sets
```
```js context=core fn=intersection
// TODO: more arguments sets
var intersection = (...args) =>{
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => intersection(s1, s2, ...sets);
  return s1.filter((x) => s2.includes(x));
}
```
```js context=test fn=intersection
intersection([1,2], [2,3]); // [2]
```

### atom 
```clj context=spec fn=atom
(atom x)(atom x & options)
```
```txt context=desc fn=atom
Creates and returns an Atom with an initial value of x and zero or
more options (in any order):
 :meta metadata-map
 :validator validate-fn
 If metadata-map is supplied, it will become the metadata on the
atom. validate-fn must be nil or a side-effect-free fn of one
argument, which will be passed the intended new state on any state
change. If the new state is unacceptable, the validate-fn should
return false or throw an exception
```
```js context=core fn=atom
var atom = (value) => {
  let state = value;
  let watchers = {};
  let validator = null;

  var deref = () =>  state;
  
  var reset = (newValue) => {
    let oldState = state;
    let validatedValue = validate(newValue);
    (state = validatedValue);
    (notifyWatchers(oldState, state));
    return (state === validatedValue); // Return true if the value passed validation
  }

  var swap = (updateFn) => {
    let oldValue = state;
    let newValue = updateFn(state);
    let validatedValue = validate(newValue);
    (state = validatedValue);
    (notifyWatchers(oldValue, state));
    return (state === validatedValue); // Return true if the value passed validation
  }

  var addWatch = (name, watcherFn) =>{
    (watchers[name] = watcherFn);
    return true;
  }

  var removeWatch = (name) => {
    delete watchers[name];
  }
  
  var notifyWatchers = (oldState, newState) => {
    for (const watcherName in watchers) {
      if (watchers.hasOwnProperty(watcherName)) {
        watchers[watcherName](oldState, newState);
      }
    }
  }
  
  var compareAndSet = (expectedValue, newValue) => {
    if (state === expectedValue) {
      let validatedValue = validate(newValue);
      (state = validatedValue);
      (notifyWatchers(expectedValue, state));
      return state === validatedValue; 
    }
    return false;
  }

  var setValidator = (validatorFn) => {
    (validator = validatorFn);
  }


  var removeValidator = () => {
    (validator = null);
  }
  

  var validate = (newValue) => {
    let defaultValidation = validator ? validator(newValue) : true;
    return defaultValidation ? newValue : state; // Return current state if validation fails
  }

  // # todo: getValidator
  return {
    deref,
    reset,
    swap,
    addWatch,
    removeWatch,
    compareAndSet,
    setValidator,
    removeValidator
  };
}
```
```js context=test fn=atom
var state = atom(0);
state.swap((n) => n - 10);
state.deref(); // -10;
state.compareAndSet(-10, 200);;
state.deref(); // 200;
state.addWatch('foo', (n, o)=> console.log('foo changed', n, 0))
state.reset(300); // printed
state.deref(); // 300;
state.removeWatch("foo"); // will not printed anymore
state.setValidator((n)=> n > 0)
state.reset(-100);; // not cahnged because validator
state.deref(); // 300
state.removeValidator(); // removed 
state.reset(-100); //
state.deref(); // cahnged into -100
```

### deref
```clj context=spec fn=deref
(deref ref)(deref ref timeout-ms timeout-val)
```
```txt context=desc fn=deref
Also reader macro: @ref/@agent/@var/@atom/@delay/@future/@promise. Within a transaction,
returns the in-transaction-value of ref, else returns the
most-recently-committed value of ref. When applied to a var, agent
or atom, returns its current state. When applied to a delay, forces
it if not already forced. When applied to a future, will block if
computation not complete. When applied to a promise, will block
until a value is delivered.  The variant taking a timeout can be
used for blocking references (futures and promises), and will return
timeout-val if the timeout (in milliseconds) is reached before a
value is available. See also - realized?.

```
```js context=core fn=deref
// todo: add ore args, timout-ms timout-val
var deref =(atom) => {
  if(!atom.deref) return null;
  return atom.deref();
}
```
```js context=test fn=deref
deref(atom(0)); // 0
```

### reset
```clj context=spec fn=reset
(reset! atom newval)
```
```txt context=desc fn=reset
Sets the value of atom to newval without regard for the
current value. Returns newval.
```
```js context=core fn=reset
var reset = (...args) => {
  let [atom, value] = args
  if(args.length === 1) return (value) => atom.reset(value);
  return (atom.reset(value), atom.deref());
}
```
```js context=test fn=reset
reset(atom(0), 100); // 100;
```

### swap
```clj context=spec fn=swap
(swap! atom f)(swap! atom f x)(swap! atom f x y)(swap! atom f x y & args)
```
```txt context=desc fn=swap
Atomically swaps the value of atom to be:
(apply f current-value-of-atom args). Note that f may be called
multiple times, and thus should be free of side effects.  Returns
the value that was swapped in.
```
```js context=core fn=swap
var swap = (...args) => {
  let [atom, fn, ...rest] = args;
  if(args.length === 1) return (fn, ...rest) => atom.swap(fn, ...rest);
  return (atom.swap(fn, ...args), atom.deref());
}
```
```js context=test fn=swap
swap(atom(0), (n)=> n + 100); // 100
```

### compareAndSet
```clj context=spec fn=compareAndSet
(compare-and-set! atom oldval newval)
```
```txt context=desc fn=compareAndSet
Atomically sets the value of atom to newval if and only if the
current value of the atom is identical to oldval. Returns true if
set happened, else false
```
```js context=core fn=compareAndSet
var compareAndSet = (...args) => {
  let [atom, expected, newVal] = args;
  if(args.length === 1) return (expected, newVal) => atom.compareAndSet(expected, newVal);  
  return  atom.compareAndSet(expected, newVal);
}
```
```js context=test fn=compareAndSet
compareAndSet(atom(9), 9, 100); //true
compareAndSet(atom(9), -9, 100); //false
```

### addWatch
```clj context=spec fn=addWatch
(add-watch reference key fn)
```
```txt context=desc fn=addWatch
Adds a watch function to an agent/atom/var/ref reference. The watch
fn must be a fn of 4 args: a key, the reference, its old-state, its new-state
```
```js context=core fn=addWatch
var addWatch = (...args)=> {
  let [atom, name, watcherFn] = args;
  if(args.length === 1) return (name, watcherFn) => atom.addWatch(name, watcherFn);
  return (atom.addWatch(name, watcherFn));
}
```
```js context=test fn=addWatch
var state = atom(0);
addWatch(state, 'watcher', (n) => console.log('changed'));
reset(state, 100); // printed
```

### removeWatch
```clj context=spec fn=removeWatch
(remove-watch reference key)
```
```txt context=desc fn=removeWatch
Removes a watch (set by add-watch) from a reference
```
```js context=core fn=removeWatch
var removeWatch = (...args) => {
  let [atom, watcherFn] = args;
  if(args.length === 1) return (watcherFn) => atom.removeWatch(watcherFn);
  return atom.removeWatch(watcherFn);
}
```
```js context=test fn=removeWatch
var state = atom(0);
addWatch(state, 'watcher', (n) => console.log('changed'));
reset(state, 100); // printed
removeWatch(state, 'watcher');
reset(state, 100); // not printed removed
```

### setValidator
```clj context=spec fn=setValidator
(set-validator! iref validator-fn)
```
```txt context=desc fn=setValidator
Sets the validator-fn for a var/ref/agent/atom. validator-fn must be nil or a
side-effect-free fn of one argument, which will be passed the intended
new state on any state change. If the new state is unacceptable, the
validator-fn should return false or throw an exception. If the current state (root
value if var) is not acceptable to the new validator, an exception
will be thrown and the validator will not be changed.
```
```js context=core fn=setValidator
var setValidator = (...args) => {
  let [atom, validatorFn] = args;
  if(args.length === 1) return (validatorFn) => atom.setValidator(validatorFn);
  return atom.setValidator(validatorFn);
}
```
```js context=test fn=setValidator
var state = atom(9);
setValidator(state, (n) => n < 0);
reset(state, 100); // it keep 9 because validated
```
