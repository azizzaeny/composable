### Objects

```js
var assoc = (...args) => {
  let [obj, key, val] = args;
  if (args.length === 3) {
    return { ...obj, [key]: val };
  } else if (args.length === 2) {
    return (val) => assoc(obj, key, val);
  }else{
    return (key, val) => assoc(obj, key, val);
  }
}

function dissoc(obj, key) {
  const { [key]: omitted, ...rest } = obj;
  return rest;
}

const assocIn = (...args) => {
  let [obj, keys, val] = args;
  if (args.length === 3) {
    keys = Array.isArray(keys) ? keys : [keys];
    return assoc(obj, keys[0], keys.length === 1 ? val : assocIn(obj[keys[0]], keys.slice(1), val));
  } else if (args.length === 2) {
    return (val) => assocIn(obj, keys, val);
  }
  // throw new Error('assocIn function must be called with at least 2 arguments');
}

// update function
function update(...args) {
  let [object, key, updateFn] = args;
  if (args.length === 2) {
    return (updateFn) => update(object, key, updateFn);
  }
  return {
    ...object,
    [key]: updateFn(object[key])
  };
}

// update-in function
function updateIn(...args) {
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

const selectKeys = (...args) => {
  let [obj, keys] = args;
  if (args.length === 2) {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => keys.includes(key)));
  } else if (args.length === 1) {
    return (keys) => selectKeys(obj, keys);
  }
  //throw new Error('selectKeys function must be called with at least 1 argument');
}

function renameKeys(obj, keyMap) {
  const renamedObj = Object.entries(obj)
    .reduce((acc, [key, value]) => keyMap[key] ? { ...acc, [keyMap[key]]: value } : { ...acc, [key]: value }, {});
  return renamedObj;
}

function mergeWith(fn, ...maps) {
  if (maps.length === 0) {
    return {};
  } else if (maps.length === 1) {
    return maps[0];
  } else {
    const [head, ...tail] = maps;
    const merged = mergeWith(fn, ...tail);
    const result = {};
    for (const [key, value] of Object.entries(head)) {
      if (key in merged) {
        result[key] = fn(merged[key], value);
      } else {
        result[key] = value;
      }
    }
    for (const [key, value] of Object.entries(merged)) {
      if (!(key in head)) {
        result[key] = value;
      }
    }
    return result;
  }
}

function getIn(coll, keys){
  return keys.reduce((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return acc[key];
    } else {
      return undefined;
    }
  }, coll);
};

const get = (obj, key) => {
  return obj[key];
};

const keys = (obj) => {
  return Object.keys(obj);
};

const vals = (obj) => {
  return Object.values(obj);
};

function zipmap(keys, vals) {
  return keys.reduce((result, key, i) => {
    result[key] = vals[i];
    return result;
  }, {});
}

```
### Array

```js
const conj = (coll, item) => {
  return [...coll, item];
};

const cons = (item, seq) => {
  return [item, ...seq];
};

const first = (seq) => {
  return seq[0];
};

const nth = (seq, n) => {
  return seq[n];
};

const peek = (stack) => {
  return stack[stack.length - 1];
};

const rest = (seq) => {
  return seq.slice(1);
};

const pop = (stack) => {
  return stack.slice(0, -1);
};

function disj(...args){
  let [coll, key, ...rest] = args;
  if (args.length === 2) {
    return coll.filter((item) => item !== key);
  } else if (args.length === 1) {
    return (key) => disj(coll, key);
  }
  throw new Error('disj function must be called with at least 1 argument');
}

const ffirst = (coll) => {
  return first(coll[0]);
};


function find(pred, coll){
  for (const item of coll) {
    if (pred(item)) {
      return item;
    }
  }
  return undefined;
};


var map = (...args) => {
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}


var filter = (...args) => {
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => filter(predicate, coll);
  }
  return arr.filter(predicate);
}

var reduce = (...args) => {
  let [reducer, initialValue, arr] = args;
  if(args.length === 1){
    return coll => reduce(reducer, null, coll);
  }
  if (args.length === 2) {
    return coll => reduce(reducer, initialValueHolder, coll)
  }
  return arr.reduce(reducer, initialValue)
}

var concat = (...args) => {
  let [arr1, arr2] = args;
  if (args.length === 1) {
    return arr2Holder => concat(arr1, arr2Holder)
  }
  return arr1.concat(arr2)
}

// mapcat
var mapcat = (...args) => {
  let [fn, arr]= args;
  if (args.length === 1) {
    return coll => mapcat(fn, coll);
  }
  return arr.map(fn).reduce((acc, val) => acc.concat(val), [])
}

// flatten
var flatten = arr => {
  const flat = [].concat(...arr)
  return flat.some(Array.isArray) ? flatten(flat) : flat
}

// distinct
var distinct = arr => [...new Set(arr)]

// remove
var remove = (...args) => {
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => remove(predicate, coll)
  }
  return arr.filter(val => !predicate(val))
}

// take-nth

var takeNth = (...args) => {
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => takeNth(n, coll)
  }
  return arr.filter((_, i) => i % n === 0);
}

// take
var take = (...args) => {
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => take(n, coll);
  }
  return arr.slice(0, n)
}

// second
var second = ([_, x]) => x

// last
const last = arr => arr[arr.length - 1]

// next
const next = ([_, ...rest]) => rest

// nfirst
const nfirst = (n = 1, arr) => arr.slice(n)

// nnext
const nnext = (n = 1, arr) => arr.slice(-n)

// fnext
const fnext = (fn, arr) => fn(...next(arr))

// take-last
const takeLast = (n, arr) => arr.slice(-n)

// take-while

const takeWhile = (...args) => {
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => takeWhile(predicate, coll)
  }
  const index = arr.findIndex(val => !predicate(val))
  return index === -1 ? arr : arr.slice(0, index)
}

// drop
const drop = (n, arr) => arr.slice(n)

// drop-last
const dropLast = (arr) => arr.slice(0, -1)

// drop-first
const dropFirst = (arr) => arr.slice(1)

// nthrest
const nthrest = (...args) => {
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => nthrest(n, coll)
  }
  return arr.filter((_, i) => i >= n)
}

const sort = (...args) => {
  let [arr, comparator = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comparator);
}


const sortBy = (...args) => {
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => [...arr].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...arr].sort((a, b) => fn(a) - fn(b));
  }
};

const mapIndexed = (...args) => {
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => arr.map((val, idx) => fn(val, idx));
  } else {
    return arr.map((val, idx) => fn(val, idx));
  }
};


const reverse = (...args) => {
  let [arr] = args;
  args.length === 1 ? [...arr].reverse() : arr.reverse();
}

/*
const numbers = [1, 2, 3];
console.log(reverse(numbers)); // [3, 2, 1]
*/

const interleave = (...arrays) => {
  if (arrays.length === 1) {
    return arr => arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arr.shift());
  } else {
    return arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arrays.shift());
  }
};

const interpose = (...args) => {
  let [sep, arr] = args;
  if (args.length === 1) {
    return arr => arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  } else {
    return arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  }
};


const compare = (a, b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};


var groupBy = (...args) => {
  let [fn, arr] = args;
  if(args.length === 1){
    return (coll) => groupBy(fn, coll);
  }
  return arr.reduce((acc, curr) => {
    const key = fn(curr);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(curr);
    return acc;
  }, {});
};

const partition = (...args) => {
  let [size, arr] = args;
  if(args.length === 1){
    return (coll) => partition(size, coll);
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};


var partitionAll = (...args) => {
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
};


// partition-by

const partitionBy = (...args) => {
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
};


// split-at
const splitAt = (n, coll) => {
  return [coll.slice(0, n), coll.slice(n)];
};

// split-with
const splitWith = (pred, coll) => {
  const a = [];
  const b = [];
  let inA = true;
  coll.forEach((elem) => {
    if (inA && pred(elem)) {
      a.push(elem);
    } else {
      inA = false;
      b.push(elem);
    }
  });
  return [a, b];
};

// shuffle
const shuffle = (coll) => {
  const result = coll.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// rand-nth
const randNth = (coll) => {
  const i = Math.floor(Math.random() * coll.length);
  return coll[i];
};

// when-first
const whenFirst = (pred, coll, fn) => {
  for (const elem of coll) {
    if (pred(elem)) {
      return fn(elem);
    }
  }
};

function vec(coll) {
  if (!coll) {
    return [];
  }
  if (Array.isArray(coll)) {
    return coll;
  }
  if (typeof coll === 'string') {
    return coll.split('');
  }
  if (typeof coll[Symbol.iterator] === 'function') {
    return Array.from(coll);
  }
  return Object.values(coll);
}

function subvec(coll, start, end) {
  if (!end) {
    end = coll.length;
  }
  if (start < 0 || end < 0) {
    throw new Error('start and end must be non-negative');
  }
  return coll.slice(start, end);
}


// repeat implementation
const repeat = (n, value) => {
  const result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = value;
  }
  return result;
};

// range implementation
const range = (start, end, step = 1) => {
  if (arguments.length === 1) {
    end = start;
    start = 0;
  }
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

function keep(pred, coll) {
  return coll.reduce((acc, curr) => {
    const result = pred(curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}


function keepIndexed(pred, coll) {
  return coll.reduce((acc, curr, idx) => {
    const result = pred(idx, curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}

function frequencies(coll) {
  const freqMap = new Map();
  for (const el of coll) {
    freqMap.set(el, (freqMap.get(el) || 0) + 1);
  }
  return Object.fromEntries(freqMap);
}

function count(coll) {
  return coll.length;
}

function union(set1, set2) {
  return Array.from(new Set([...set1, ...set2]));
}

function difference(arr1, arr2) {
  return arr1.filter((x) => !arr2.includes(x));
}

function intersection(arr1, arr2) {
  return arr1.filter((x) => arr2.includes(x));
}

```

### Checks

```js

function notEmpty(coll) {
  return coll.length > 0 ? coll : null;
}

function empty(coll) {
  return coll.length === 0;
}


function contains(key, coll){
  if (coll instanceof Map || coll instanceof Set) {
    return coll.has(key);
  } else if (Array.isArray(coll)) {
    return coll.includes(key);
  } else {
    return Object.prototype.hasOwnProperty.call(coll, key);
  }
};

/*
contains({ a: 1, b: 2 }, 'a'); // true
contains(new Set([1, 2, 3]), 4); // false
*/

function isZero(x) {
  return x === 0;
}

function isPos(x) {
  return x > 0;
}

function isNeg(x) {
  return x < 0;
}

function isEven(x) {
  return x % 2 === 0;
}

function isOdd(x) {
  return x % 2 !== 0;
}

function isInt(x) {
  return Number.isInteger(x);
}

function isTrue(x) {
  return x === true;
}

function isFalse(x) {
  return x === false;
}

function isInstanceOf(x, type) {
  return x instanceof type;
}

function isNil(x) {
  return x === null;
}

function isSome(x) {
  return x != null;
}

function isFn(value) {
  return typeof value === 'function';
}

function isIncludes(coll, value) {
  return coll.includes(value);
}

function isBlank(value) {
  return typeof value === 'string' && value.trim() === '';
}

function isArray(value) {
  return Array.isArray(value);
}

function isNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value);
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value) {
  return typeof value === 'string';
}

function isIdentical(x, y) {
  return x === y;
}

function isColl(value) {
  return typeof value === 'object' && value !== null;
}

/*
  isFn(() => {}); // true
isIncludes([1, 2, 3], 2); // true
isBlank(''); // true
isArray([1, 2, 3]); // true
isNumber(42); // true
isObject({ a: 1, b: 2 }); // true
isString('hello'); // true
isIdentical(2, 2); // true
isColl({}); // true
*/

function isSubset(set1, set2) {
  for (let item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }
  return true;
}

function isSuperset(set1, set2) {
  for (let item of set2) {
    if (!set1.has(item)) {
      return false;
    }
  }
  return true;
}

function isDistinct(arr) {
  return arr.length === new Set(arr).size;
}

function isEmptyArray(arr) {
  return arr.length === 0;
}

function isEmptySet(set) {
  return set.size === 0;
}

function isEveryEven(arr) {
  return arr.every(num => num % 2 === 0);
}

function isNotEveryEven(arr) {
  return arr.some(num => num % 2 !== 0);
}

function isNotAnyEven(arr) {
  return !arr.some(num => num % 2 === 0);
}

function isDeepEqual(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  } else if (typeof a === 'object' && typeof b === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!isDeepEqual(a[key], b[key])) return false;
    }
    return true;
  } else {
    return a === b;
  }
}

/*
const a = { a: [1, 2, { b: 'c' }], d: { e: [3, 4] } };
const b = { a: [1, 2, { b: 'c' }], d: { e: [3, 4] } };
const c = { a: [1, 2, { b: 'd' }], d: { e: [3, 4] } };

console.log(isDeepEqual(a, b)); // true
console.log(isDeepEqual(a, c)); // false
*/

function eq(a, b) {
  return a === b;
}

function eqv(a, b) {
  return a == b;
}

function neq(a, b) {
  return a !== b;
}

function gt(a, b) {
  return a > b;
}

function lt(a, b) {
  return a < b;
}

function gte(a, b) {
  return a >= b;
}

function lte(a, b) {
  return a <= b;
}
 
```

### Function
```js
function apply(fn, args) {
  return fn(...args);
}

function comp(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

function some(fn, coll) {
  for (let i = 0; i < coll.length; i++) {
    if (fn(coll[i])) {
      return true;
    }
  }
  return false;
}

function constantly(x) {
  return function() {
    return x;
  };
}

function identity(x) {
  return x;
}

function fnil(f, defaultVal) {
  return function() {
    const args = Array.from(arguments);
    const numArgs = f.length;
    while (args.length < numArgs) {
      args.push(defaultVal);
    }
    return f.apply(null, args);
  };
}

function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    }
    return cache.get(key);
  };
}

function everyPred(...fns) {
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (!fns[i](x)) {
        return false;
      }
    }
    return true;
  };
}

function complement(fn) {
  return function(...args) {
    return !fn(...args);
  };
}

function partial(fn, ...args) {
  return function(...moreArgs) {
    return fn(...args, ...moreArgs);
  };
}

function juxt(...fns) {
  return function(...args) {
    return fns.map(function(fn) {
      return fn(...args);
    });
  };
}

function someFn(...fns) {
  return function(x) {
    for (let i = 0; i < fns.length; i++) {
      if (fns[i](x)) {
        return true;
      }
    }
    return false;
  };
}

function thread(val, ...forms) {
  return forms.reduce((acc, form) => form(acc), val);
}

/*
thread(1, x => x + 2, x => x * 3); // returns 9
*/

function threadLast(val, ...forms) {
  return forms.reduceRight((acc, form) => form(acc), val);
}

/*
threadLast(1, x => x + 2, x => x * 3); // returns 9
*/

function threadAs(name, val, ...forms) {
  return forms.reduce((acc, form) => form(name ? { [name]: acc } : acc), val);
}

/*
threadAs('x', 1, x => ({ y: x + 2 }), ({ y, x }) => ({ z: y * x })); // returns { z: 3 }
*/

function condThread(val, ...clauses) {
  return clauses.reduce((acc, [pred, ...forms]) => pred(acc) ? thread(acc, ...forms) : acc, val);
}

/*
condThread(0,
  [x => x === 0, x => x + 2],
  [x => x === 2, x => x * 3]
); // returns 2
*/

function condThreadLast(val, ...clauses) {
  return clauses.reduceRight((acc, [pred, ...forms]) => pred(acc) ? threadLast(acc, ...forms) : acc, val);
}

/*
condThreadLast(0,
  [x => x === 0, x => x + 2],
  [x => x === 2, x => x * 3]
); // returns 6
*/

function someThread(val, ...forms) {
  for (let form of forms) {
    if (val == null) {
      return val;
    }
    val = form(val);
  }
  return val;
}

function someThreadLast(input, ...forms) {
  return forms.reduce((acc, form) => {
    if (acc === null || acc === undefined) {
      return null;
    }
    if (typeof form === "function") {
      return form(acc);
    }
    if (Array.isArray(acc)) {
      return acc.some(item => {
        return typeof item[form] === "function" ? item[form]() : false;
      })
        ? acc
        : null;
    }
    return form in acc ? acc[form] : null;
  }, input);
}
function defMulti(dispatchFn) {
  const methods = [];

  function multiFn(...args) {
    const dispatchValue = dispatchFn(...args);
    const dispatchIndex = methods.findIndex(method => method.dispatchValue === dispatchValue);

    if (dispatchIndex < 0) {
      throw new Error(`No method defined for dispatch value: ${dispatchValue}`);
    }

    const dispatchFn = methods[dispatchIndex].methodFn;

    return dispatchFn(...args);
  }

  return multiFn;
}

function defMethod(multiFn, dispatchValue, methodFn) {
  multiFn.methods.push({ dispatchValue, methodFn });
}
```

### Math
```js
// Returns a random floating-point number between 0 (inclusive) and 1 (exclusive)
function rand() {
  return Math.random();
}

// Returns a random integer between 0 (inclusive) and the specified maximum (exclusive)
function randInt(max) {
  return Math.floor(Math.random() * max);
}

/*
 // Generate a random number between 0 (inclusive) and 1 (exclusive)
let randomNum = rand();

// Generate a random integer between 0 (inclusive) and 10 (exclusive)
let randomInt = randInt(10);
*/

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function quot(a, b) {
  return Math.floor(a / b);
}

function mod(a, b) {
  return a % b;
}

function rem(a, b) {
  return ((a % b) + b) % b;
}

function incr(num) {
  return num + 1;
}

function decr(num) {
  return num - 1;
}

function max(a, b) {
  return Math.max(a, b);
}

function min(a, b) {
  return Math.min(a, b);
}

function toInt(num) {
  return parseInt(num);
}

function toIntSafe(num) {
  return parseInt(num.toString());
}

```

### Reducer (test)
```js

function transduce(xform, f, coll) {
  const xf = xform(f);
  let result = xf[init]();

  for (const item of coll) {
    const res = xf[step](result, item);
    if (res && res['@@transducer/reduced']) {
      result = res['@@transducer/value'];
      break;
    } else {
      result = res;
    }
  }

  return xf[completion](result);
}

function dedupe() {
  const seen = new Set();
  return (f) => ({
    ['@@transducer/init']: f[init],
    ['@@transducer/step']: (result, item) => {
      if (seen.has(item)) {
        return result;
      }
      seen.add(item);
      return f[step](result, item);
    },
    ['@@transducer/completion']: f[completion]
  });
}

const arr = [1, 2, 3, 3, 4, 5];
const sum = (acc, val) => acc + val;
const double = (val) => val * 2;
const takeWhile = (pred) => (f) => ({
  ['@@transducer/init']: f[init],
  ['@@transducer/step']: (result, item) => pred(item) ? f[step](result, item) : result,
  ['@@transducer/completion']: f[completion]
});

const push = (acc, val) => {
  acc.push(val);
  return acc;
};


const res = transduce(
  compose(takeWhile((val) => val < 5), dedupe(), map(double)),
  sum,
  arr
);
console.log(res); // Output: 10

const map = f => xf => (reducer) => {
  return xf((acc, x) => reducer(acc, f(x)))
}

const filter = pred => xf => (reducer) => {
  return xf((acc, x) => pred(x) ? reducer(acc, x) : acc)
}

const transducer = compose(
  map(x => x * 2),
  filter(x => x % 2 === 0)
)
const arr = [1, 2, 3, 4, 5]
const doubledEvens = transduce(transducer, push(), arr)
console.log(doubledEvens) // [4, 8]

const arr = [1, 2, 3, 4, 5]
const sumOfDoubledEvens = transduce(
  transducer,
  (acc, x) => acc + x,
  0,
  arr
)
console.log(sumOfDoubledEvens) // 12

```

### State
```js
function atom(val) {
  let value = val;
  let watchers = new Set();
  let validator = undefined;

  function deref() {
    return value;
  }

  function reset(newVal) {
    if (validator !== undefined) {
      validator(newVal);
    }
    const oldVal = value;
    value = newVal;
    watchers.forEach((watcher) => watcher(newVal, oldVal));
    return newVal;
  }

  function swap(fn, ...args) {
    return reset(fn(value, ...args));
  }

  function compareAndSet(expectedVal, newVal) {
    if (deref() === expectedVal) {
      reset(newVal);
      return true;
    } else {
      return false;
    }
  }

  function addWatch(watcherFn) {
    watchers.add(watcherFn);
  }

  function removeWatch(watcherFn) {
    watchers.delete(watcherFn);
  }

  function setValidator(validatorFn) {
    validator = validatorFn;
  }

  function getValidator() {
    return validator;
  }

  return {
    deref,
    reset,
    swap,
    compareAndSet,
    addWatch,
    removeWatch,
    setValidator,
    getValidator,
  };
}

function deref(atom){
  return atom.deref();
}

```

### String
```js

function subs(str, start, end) {
  return str.substring(start, end);
}

// Example usage:
// subs("hello world", 0, 5); // "hello"

function splitLines(str) {
  return str.split("\n");
}

// Example usage:
// splitLines("hello\nworld"); // ["hello", "world"]

function replace(str, pattern, replacement) {
  return str.replace(new RegExp(pattern, "g"), replacement);
}

// Example usage:
// replace("hello world", "o", "a"); // "hella warld"

function replaceFirst(str, pattern, replacement) {
  return str.replace(pattern, replacement);
}

// Example usage:
//replaceFirst("hello world", "o", "a"); // "hella world"

function join(arr, separator) {
  return arr.join(separator);
}

// Example usage:
//join(["hello", "world"], " "); // "hello world"

function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Example usage:
//escape("hello.world"); // "hello\.world"

function rePattern(pattern) {
  return new RegExp(pattern);
}

// Example usage:
//rePattern("hello.*"); // /hello.*/

function reMatches(str, pattern) {
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;

  while ((match = regex.exec(str)) !== null) {
    matches.push(match[0]);
  }

  return matches;
}

// Example usage:
// reMatches("hello world", "l+"); // ["ll"]

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Example usage:
//capitalize("hello world"); // "Hello world"

function lowerCase(str) {
  return str.toLowerCase();
}

// Example usage:
// lowerCase("HELLO WORLD"); // "hello world"

function upperCase(str) {
  return str.toUpperCase();
}

// Example usage:
// upperCase("hello world"); // "HELLO WORLD"


function trim(str) {
  return str.trim();
}

// Example usage:
// trim("   hello world   "); // "hello world"

function trimNewline(str) {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, '');
}

function trimL(str) {
  return str.replace(/^\s+/, '');
}

function trimR(str) {
  return str.replace(/\s+$/, '');
}

function char(n) {
  return String.fromCharCode(n);
}

```

---
