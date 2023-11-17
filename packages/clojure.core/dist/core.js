var get = (...args) => {
  let [obj, key] = args;
  if(args.length === 2){
    return obj[key];
  }else{
    return (keyA) => obj[keyA];
  }
}

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

var dissoc = (...args) =>{
  let [obj, key] = args;
  if(args.length === 1){
    return (keyA) => dissoc(obj, keyA);
  }
  let { [key]: omitted, ...rest } = obj;
  return rest;
}

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

var assocIn = (...args) =>{
  let [obj, keys, val] = args;
  if (args.length === 3) {
    keys = Array.isArray(keys) ? keys : [keys];
    return assoc(obj, keys[0], keys.length === 1 ? val : assocIn(obj[keys[0]], keys.slice(1), val));
  } else if (args.length === 2) {
    return (val) => assocIn(obj, keys, val);
  }
}

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

var merge = (...args) =>{
  return Object.assign({}, ...args);
}

var mergeWith = (...args) =>{
  let [fn, ...maps] = args;
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

var selectKeys = (...args) =>{
  let [obj, keys] = args;
  if (args.length === 2) {
    return Object.fromEntries(Object.entries(obj).filter(([key, value]) => keys.includes(key)));
  } else if (args.length === 1) {
    return (keys) => selectKeys(obj, keys);
  }
}

var renameKeys = (...args) =>{
  let [obj, keyMap] = args;
  if(args.length === 1){
    return (keyMapA) => renameKeys(obj, keyMapA);
  }
  return Object.entries(obj)
    .reduce((acc, [key, value]) => keyMap[key] ? { ...acc, [keyMap[key]]: value } : { ...acc, [key]: value }, {});
}

var keys = (obj) => Object.keys(obj);

var vals = (obj)=> Object.values(obj);

var zipmap = (...args) =>{
  let [keys, vals] = args;
  if(args.length === 1){
    return (valsA) => zipmap(keys, valsA);
  }
  return keys.reduce((result, key, i) => {
    result[key] = vals[i];
    return result;
  }, {});
}

var count = (coll) => coll.length;

var conj = (...args) =>{
  let [coll, ...items] = args;
  return (args.length === 1)
    ? (itemA) => conj(coll, itemA)
    : [...coll, ...items]
}

var cons = (...args) =>{
  let [item, ...seq] = args;
  return (args.length === 1)
    ? (seqA) => cons(item, seqA)
    : [item].concat(...seq)
}

var first = (seq) => seq[0];

var ffirst = (seq) => first(seq[0])

var nth = (...args) => {
  let [seq, n] = args;
  if(args.length === 1) return (nn) => nth(seq, nn);
  return seq[n];
}

var seq = (arg) =>{
  if(Array.isArray(arg)){
    return arg;
  }
  if(typeof arg === "object"){
    return Object.entries(arg);
  }
  if(typeof arg === "string"){
    return Array.from(arg);
  }
  return arg;
}

var peek = (stack) => stack[stack.length - 1];

var rest = (seq) => seq.slice(1);

var pop = (stack) => stack.slice(0, -1);

var disj = (...args) =>{
  let [coll, key, ...rest] = args;
  if (args.length === 2) {
    return coll.filter((item) => item !== key);
  } else if (args.length === 1) {
    return (key) => disj(coll, key);
  }
}

var takeNth = (...args) => {
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => takeNth(n, coll)
  }
  return arr.filter((_, i) => i % n === 0);
}

var take = (...args) =>{
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => take(n, coll);
  }
  return arr.slice(0, n);
}

var second = ([_, x]) => x;

var last = (arr) => arr[arr.length - 1];

var next = ([_, ...rest]) => { return rest; }

var nfirst = (arr) =>  next(first(arr));

var nnext = (arr) => next(next(arr));

var fnext = (arr) => first(next(arr));

var takeLast= (...args)=>{
  let [n, arr] = args
  if(args.length === 1) return (arr1) => takeLast(n, arr1);
  return arr.slice(-n);  
}

var takeWhile = (...args) =>{
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => takeWhile(predicate, coll)
  }
  const index = arr.findIndex(val => !predicate(val))
  return index === -1 ? arr : arr.slice(0, index)
}

var nthrest = (...args) =>{
  let [n, arr] = args;
  if (args.length === 1) {
    return coll => nthrest(n, coll)
  }
  return arr.filter((_, i) => i >= n)
}

var drop = (...args) => {
  let [n, arr] = args;
  if(args.length === 1) {
    return (arr1) => drop(n, arr1);
  }
  return arr.slice(n);
}

var dropLast = (arr) => { return arr.slice(0, -1); }

var splitAt = (...args) =>{
  let [n, coll] = args;
  return (args.length === 1)
    ? (colln) => splitAt(n, colln)
    : [coll.slice(0, n), coll.slice(n)]
}

var shuffle = (coll) => {
  const result = coll.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

var randNth = (coll) => {
  const i = Math.floor(Math.random() * coll.length);
  return coll[i];
};

var vec = (coll) =>{
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

var subvec = (coll, start, end)=>{
  if (!end) {
    end = coll.length;
  }
  if (start < 0 || end < 0) {
    throw new Error('start and end must be non-negative');
  }
  return coll.slice(start, end);
}

// repeat implementation
var repeat = (...args) => {
  let [n, value] = args;
  if(args.length === 1) return (nvalue) => repeat(n,nvalue);
  let result = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = value;
  }
  return result;
};

var range = (...args) => {
  let [start, end, step=1] = args
  if (args.length === 1) {
    end = start;
    start = 0;
  }
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

var keep = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => keep(pred, ncoll);
  return coll.reduce((acc, curr) => {
    const result = pred(curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}

var keepIndexed = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => keepIndexed(pred, ncoll);  
  return coll.reduce((acc, curr, idx) => {
    const result = pred(idx, curr);
    if (result !== null && result !== undefined) {
      acc.push(result);
    }
    return acc;
  }, []);
}

var find = (...args) => {
  let [pred, coll] = args;
  if(args.length === 1) return (ncoll) => find(pred, ncoll);
  for (const item of coll) {
    if (pred(item)) {
      return item;
    }
  }
  return undefined;
};

var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}

var filter = (...args) =>{
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => filter(predicate, coll);
  }
  return arr.filter(predicate);
}

var remove = (...args) =>{
  let [pred, coll] = args;
  return (args.length === 1) ? (colln) => remove(pred, colln) :  coll.filter(item => !pred(item));
}

var every = (...args) =>{
  let [predicate, arr] = args ;
  if(args.length === 1){
    return coll => every(predicate, coll);
  }
  return arr.every(predicate);
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

var concat=(...args)=>{
  let [arr1, arr2] = args;
  if (args.length === 1) {
    return (arr2Holder) => concat(arr1, arr2Holder)
  }
  return arr1.concat(arr2)
}

var mapcat=(...args)=>{
  let [fn, arr]= args;
  if (args.length === 1) {
    return coll => mapcat(fn, coll);
  }
  return arr.map(fn).reduce((acc, val) => acc.concat(val), [])
}

var mapIndexed = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => arr.map((val, idx) => fn(val, idx));
  } else {
    return arr.map((val, idx) => fn(val, idx));
  }
}

var flatten =(...args) => {
  let [arr, level] = args;
  if(args.length === 1){
    level = Infinity;
  }
  return arr.flat(level);
}

var distinct = (arr) =>{
  return [...new Set(arr)];
}

var interleave = (...arrays) =>{
  if (arrays.length === 1) {
    return arr => arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arr.shift());
  } else {
    return arrays.reduce((acc, arr) => acc.flatMap((val, i) => [val, arr[i]]), arrays.shift());
  }  
}

var interpose = (...args) => {
  let [sep, arr] = args;
  if (args.length === 1) {
    return arr => arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  } else {
    return arr.flatMap((val, i) => i === arr.length - 1 ? val : [val, sep]);
  } 
}

var reverse = (...args) =>{
  let [arr] = args;
  return args.length === 1 ? [...arr].reverse() : arr.reverse();
}

var sort = (...args) => {
  let [arr, comparator = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comparator);
}

var sortBy=(...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return arr => [...arr].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...arr].sort((a, b) => fn(a) - fn(b));
  }
}

var compare = (a , b) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
}

var groupBy = (...args) =>{
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
}

var partition=(...args) =>{
  let [size, arr] = args;
  if(args.length === 1){
    return (coll) => partition(size, coll);
  }
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

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

var frequencies = (coll) => {
  const freqMap = new Map();
  for (const el of coll) {
    freqMap.set(el, (freqMap.get(el) || 0) + 1);
  }
  return Object.fromEntries(freqMap);
}

var union = (...args) => {
  let [set1, set2] = args;
  return (args.length == 1) ? (set) => union(set1, set) : Array.from(new Set([...set1, ...set2]));
}

var difference =(...args) => {
  let [arr1, arr2] = args;
  if(args.length === 1) return (arr) => difference(arr1, arr);
  return arr1.filter((x) => !arr2.includes(x));
}

var intersection = (...args) =>{
  let [arr1, arr2] = args;
  if(args.length === 1) return (arr) => intersection(arr1, arr);
  return arr1.filter((x) => arr2.includes(x));
}

function apply(...argv) {
  let [fn, args] = argv;  
  return (argv.length === 1) ? (argn) => apply(fn, argn) : fn(...args);
}

function comp(...fns) {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
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

var partialRight = (fn, ...leftArgs) => {
  return (...rightArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

var partialLeft = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

function thread(val, ...forms) {
  return forms.reduce((acc, form) => {
    //let fn = partialRight(form);
    let fn = form;
    return fn(acc);    
  }, val);                     
}

var condThread = (value, ...conditions) => {
  return conditions.reduce((acc, condition, index, array) => {
    if (index % 2 === 0) { // Check if the current index is even (condition)
      return condition(acc) ? array[index + 1](acc) : acc;
    }
    return acc; // For odd indices (transform functions), do nothing
  }, value);
};

function isNotEmpty(coll) {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length > 0)
  }
  return coll.length > 0;
}

function isEmpty(coll) {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
}

function isContains(...args){
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

function isIncludes(coll, value) {
  return coll.includes(value);
}

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

function isEqual(a, b) {
  return a === b;
}

function isColl(value) {  // TODO fix this, add Array check also
  return (value !== null && typeof value === 'object');
}

function isNotEqual(a, b) {
  return a !== b;
}

function isGt(a, b) {
  return a > b;
}

function isGte(a, b) {
  return a >= b;
}

function isLt(a, b) {
  return a < b;
}

function isLte(a, b) {
  return a <= b;
}

// function isSubset(set1, set2) {
//   for (let item of set1) {
//     if (!set2.has(item)) {
//       return false;
//     }
//   }
//   return true;
// }

// function isSuperset(set1, set2) {
//   for (let item of set2) {
//     if (!set1.has(item)) {
//       return false;
//     }
//   }
//   return true;
// }

function isDistinct(arr) {
  return arr.length === new Set(arr).size;
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
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!isDeepEqual(a[key], b[key])) return false;
    }
    return true;
  } else {
    return a === b;
  }
}

function rand() {
  return Math.random();
}

function randInt(max=100) {
  return Math.floor(Math.random() * max);
}

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

function subs(str, start, end) {
  return str.substring(start, end);
}

function splitLines(str) {
  return str.split("\n");
}

function replace(str, pattern, replacement) {
  return str.replace(new RegExp(pattern, "g"), replacement);
}

function replaceFirst(str, pattern, replacement) {
  return str.replace(pattern, replacement);
}

function join(arr, separator) {
  return arr.join(separator);
}

function escape(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rePattern(pattern) {
  return new RegExp(pattern);
}

function reMatches(str, pattern) {
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;
  while ((match = regex.exec(str)) !== null) {
    matches.push(match[0]);
  }
  return matches;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function lowerCase(str) {
  return str.toLowerCase();
}

function upperCase(str) {
  return str.toUpperCase();
}

function trim(str) {
  return str.trim();
}

function trimNewLine(str) {
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

function atom(initialValue) {
  let state = initialValue;
  let watchers = {};
  let validator = null;

  function deref() {
    return state;
  }

  function reset(newValue) {
    const oldState = state;
    const validatedValue = validate(newValue);
    state = validatedValue;
    notifyWatchers(oldState, state);
    return state === validatedValue; // Return true if the value passed validation
  }

  function swap(updateFn) {
    const oldValue = state;
    const newValue = updateFn(state);
    const validatedValue = validate(newValue);
    state = validatedValue;
    notifyWatchers(oldValue, state);
    return state === validatedValue; // Return true if the value passed validation
  }

  function addWatch(name, watcherFn) {
    watchers[name] = watcherFn;
  }

  function removeWatch(name) {
    delete watchers[name];
  }

  function notifyWatchers(oldState, newState) {
    for (const watcherName in watchers) {
      if (watchers.hasOwnProperty(watcherName)) {
        watchers[watcherName](oldState, newState);
      }
    }
  }

  function compareAndSet(expectedValue, newValue) {
    if (state === expectedValue) {
      const validatedValue = validate(newValue);
      state = validatedValue;
      notifyWatchers(expectedValue, state);
      return state === validatedValue; // Return true if the value passed validation
    }
    return false;
  }

  function setValidator(validatorFn) {
    validator = validatorFn;
  }

  function removeValidator() {
    validator = null;
  }
  
  function validate(newValue) {
    const defaultValidation = validator ? validator(newValue) : true;
    return defaultValidation ? newValue : state; // Return current state if validation fails
  }

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

function deref(atom){
  return atom.deref();
}

function reset(atom, value){
  atom.reset(value)
  return atom;
}

function swap(atom, fn, ...args){
  atom.swap(fn, ...args);
  return atom;
}

function compareAndSet(atom, expected, newVal){
  atom.compareAndSet(expected, newVal);
  return atom;
}

function addWatch(atom, name, watcherFn){
  atom.addWatch(name, watcherFn);
  return atom;
}

function removeWatch(atom, watcherFn){
  atom.removeWatch(watcherFn)
  return atom;
}

function setValidator(atom, validatorFn){
  atom.setValidator(validatorFn);
  return atom;
}

function removeValidator(atom){
  atom.removeValidator();
  return atom;
}

module.exports = {
  // object,
  get, getIn, assoc, dissoc, update, assocIn, updateIn, merge, mergeWith, selectKeys, renameKeys, keys, vals, zipmap,
  // collections
  count, conj, cons, first, ffirst, nth, seq, peek, rest, pop, disj, takeNth, take, second, last, next, fnext, takeLast, takeWhile, distinct, 
  nthrest, drop, dropLast, splitAt, shuffle, randNth, vec, subvec, repeat, range, keep, keepIndexed, sort, sortBy, compare, nfirst, nnext,
  map, filter, reduce, find,every, remove, concat, mapcat, mapIndexed, flatten, interleave, interpose, reverse, groupBy, partition, partitionAll, partitionBy,
  frequencies, union, difference, intersection,
  // functions
  apply, comp, constantly, identity, fnil, memoize, everyPred, complement, partial, juxt, someFn, partialRight, partialLeft, thread, condThread,  
  // checks
  isNotEmpty, isEmpty, isContains, isIncludes, isIncludes, isZero, isPos, isNeg, isEven, isOdd, isInt, isTrue, isFalse, isInstanceOf, isSome, isFn, isDeepEqual, isNil,
  isBlank, isArray, isObject, isNumber, isString, isIdentical, isEqual, isNotEqual, isGt, isGte, isLt, isLte, isDistinct, isEveryEven, isNotEveryEven, isNotAnyEven, isColl,
  // maths
  rand, randInt, add, subtract, multiply, divide, quot, mod, rem, incr, decr, max, min, toInt, toIntSafe,
  // strings
  subs, splitLines, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewLine, trimL, trimR, char,
  // state
  atom, deref, reset, swap, addWatch, removeWatch, setValidator, compareAndSet, removeValidator,
  // mutli method  
}