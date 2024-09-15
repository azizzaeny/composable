var partial = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

var apply = (...argv) => {
  let [fn, ...args] = argv;  
  return (argv.length === 1) ? (argn) => apply(fn, argn) : fn(...args);
}

var comp = (...fns) => {
  return function(x) {
    return fns.reduceRight(function(acc, fn) {
      return fn(acc);
    }, x);
  };
}

var constantly = (x) => {
  return function() {
    return x;
  };
}

var identity = (x) =>  x;

var fnil = (f, x) =>{
  return function() {
    const args = Array.from(arguments);
    const numArgs = f.length;
    while (args.length < numArgs) { args.push(x); }
    return f.apply(null, args);
  };
}

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

var complement = (f) => {
  return function(...args) {
    return !f(...args);
  };
}

var complement = (f) => {
  return (...args) => !f(...args);
};

var juxt =(...fns) => {
  return function(...args) {
    return fns.map(function(fn) {
      return fn(...args);
    });
  };
}

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

var partialRight = (fn, ...leftArgs) => {
  return (...rightArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
};

var or = (...args) =>  args.find(Boolean) || false;

var and = (...tests) =>  tests.every(Boolean);

var doseq = (seq, bodyFn) => {
  seq.forEach(item => bodyFn(item) );
};

var dof = (...exprs) => {
  let result;
  exprs.forEach(fn => {
    result = fn();
  });
  return result;
};

var isGt = (a, b) => {
  if(!b) return (b) => isGt(a, b);
  return a > b;
}

var isGte = (a, b) => {
  if(!b) return  (b) => isGte(a,b);
  return a >= b;
}

var isLt = (a, b) => {
  if(!b) return (b) => isLt(a, b);
  return a < b;
}

var isLte = (a, b) => {
  if(!b) return (b) => isLt(a, b);
  return a <= b;
}

var isEqual = (...args) =>{
  let [a, b] = args;
  if(args.length === 1) return (b) => isEqual(a, b);  
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

var isZero = (x) =>  x === 0;

var isPos = (x) => x > 0;

var isNeg = (x) => x < 0;

var isInt = (x) => Number.isInteger(x);

var isBoolean = (x) => typeof x === 'boolean';

var isTrue = x => x === true;

var isFalse = x => x === false;

var isInstance = (x, type) => x instanceof type;

var isNil = (x) => x === null;

var isSome = x => x !== null;

var isFn = (x) => typeof x === 'function';

var isBlank = x => typeof x === 'string' && x.trim() === '';

var isNumber = value => typeof value === 'number' && !Number.isNaN(value)

var isEven = (x) =>  x % 2 === 0;

var isOdd= (x) =>  x % 2 !== 0;

var isColl = (value) =>  (value !== null && typeof value === 'object');

var isVector =(value) =>  Array.isArray(value);
var isArray = isVector;

var isMap = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
var isObject = isMap;

var isEmpty = (coll) => {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
}

var not = (x) => !x;

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

var isIncludes = (s, substr) => {
  if(!substr) return (substr) => isIncludes(s, substr);
  return s.includes(substr)
}

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

var cond = (...clauses) => {
  return clauses.reduce((acc, [condition, result]) => {
    return acc === undefined && (condition === true || Boolean(condition)) ? result : acc;
  }, undefined);
};

var condp = (pred, expr, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    let value = clauses[i];
    let result = clauses[i + 1];
    if (pred(expr, value)) { return result; }
  }
  let fallback = clauses[clauses.length - 1];
  return typeof fallback === 'function' ? fallback(expr) : fallback;
};

var condtf = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      return fn(acc, ...args);  // Thread the value as the first argument
    }
    return acc;  // Skip if the condition is false
  }, val);
};

var condtl = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      let fns = partialRight(fn, ...args);
      return fns(acc);  // Thread the value as the last argument
    }
    return acc;  // Skip if condition is false
  }, val);
};

var when = (test, ...body) => {
  if (test) body.forEach(fn => fn());
};

var whenNot = (test, ...body) => {
  if (!test) { body.forEach(fn => fn()); }
};

var iff = (test, thenFn, elseFn = () => {}) => {
  return test ? thenFn() : elseFn();
};

var ifNot = (test, thenFn, elseFn = () => {}) => {
  if (!test) {
    return thenFn();
  } else {
    return elseFn();
  }
};

var casef = (e, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    if (clauses[i] === e) {
      return clauses[i + 1];
    }
  }
  return clauses[clauses.length - 1]; // Default case
};

var add = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a + b;
  if(args.length === 2) return a + b;
  return args.reduce((sum, num) => sum + num, 0);
}

var subtract = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a - b;
  if(args.length === 2) return a - b;
  return args.reduce((sum, num) => sum - num);
}

var multiply = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a * b;
  if(args.length === 2) return a * b;
  return args.reduce((acc, n) => acc * n);
}

var divide = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a / b;
  if(args.length === 2) return a / b;
  return args.reduce((acc, n) => acc / n);
}

var quot = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.floor(a / b);
  return Math.floor(a / b);
}

var mod = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a % b;
  return a % b;
}

var rem = (...args) => {
  let [a, b] = args;
  if (args.length === 1) return (b) => ((a % b) + b) % b;
  return ((a % b) + b) % b;
}

var inc = num => num + 1;

var dec = num => num - 1;

var max = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.max(a, b);  
  if(args.length === 2) return Math.max(a, b);
  return args.reduce((acc, val) => Math.max(acc, val))
}

var min = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.min(a, b);
  if(args.length === 2) return Math.min(a, b);
  return args.reduce((acc, val) => Math.min(acc, val));
}

var toInt = (num) => parseInt(num.toString());

var subs = (...args) => {
  let [str, start, end] = args;
  if(args.length === 1) return (start, end) => str.substring(start, end);
  return str.substring(start, end);
}

var replace = (...args) =>{
  let [s, match, replacement] = args;
  if(args.length === 1) return (match, replacement) => s.replace(match, replacement);
  return s.replace(new RegExp(match, "g"), replacement);
}

var replaceFirst = (...args) => {
  let [str, pattern, replacement] = args;
  if(args.length === 1) return (pattern, replacement) => str.replace(pattern, replacement);
  return str.replace(pattern, replacement);
}

var join =(...args) => {
  let [arr, separator] = args;
  if(args.length === 1) return (separator) => arr.join(separator);
  return arr.join(separator);
}

var escape = (str) =>  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

var rePattern = (pattern) =>  new RegExp(pattern);

var reMatches = (...args) => {
  let [str, pattern] = args;
  if(args.length === 1) return (pattern) => reMatches(str, pattern);
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;
  while ((match = regex.exec(str)) !== null) { matches.push(match[0]); }
  return matches;
}

var capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

var lowerCase = (str) => {
  return str.toLowerCase();
}

var upperCase = (str) => {
  return str.toUpperCase();
}

var trim = (str) => {
  return str.trim();
}

var trimNewline = (str) => {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, '');
}

var triml =(str) => {
  return str.replace(/^\s+/, '');
}

var trimr = (str) {
  return str.replace(/\s+$/, '');
}

var char = (n) => {
  return String.fromCharCode(n);
}

var keys = (m) => Object.keys(m);

var vals = (m) => Object.values(m);

var count  = (coll) =>{
  if(isMap(coll)) return keys(coll).length;
  return coll.length;
}

var conj = (...[coll, ...xs]) =>{
  if(!xs || xs.length === 0) return (...xs) => conj(coll, ...xs);
  return [...coll, ...xs];
}

var cons = (...[x, ...seq]) =>{
  if(!seq || seq.length ===0) return (...seq) => cons(x, ...seq);
  return [x].concat(...seq);
}

// todo: fix disj
var disj = (...[st, k, ...ks]) =>{
  if(!k) return (k, ...ks) => disj(st, k, ...ks);
  return st.filter(item => item !== k)
}

var concat = (...[x,...zs]) => {
  if(!zs) return (...zs) => concat(x, ...zs);
  return x.concat(...zs);
}

var first = (seq) => seq[0];

var ffirst = (seq) => first(seq[0])

var second = ([_, x]) => x;

var last = (arr) => arr[arr.length - 1];

var next = ([_, ...rest]) => { return rest; }

var nfirst = (x) =>  next(first(x));

var nnext = (x) => next(next(x));

var fnext = (x) => first(next(x));

var take = (...[n, coll]) => {
  if(!coll) return (coll) => take(n, coll);
  return coll.slice(0, n);
}

// todo: check takeNth
var takeNth = (...[n, coll]) => {
  if(!coll) return (coll) => takeNth(n, coll);
  return coll.filter((_, i) => i % n === 0);
}

var takeNth = (...[n, coll]) => {
  if (!coll) return coll => takeNth(n, coll)
  return coll.filter((_, i) => i % n === 0);
}

var takeLast= (...[n, coll])=>{  
  if(!coll) return (coll) => takeLast(n, arr1=coll);
  return coll.slice(-n);  
}

var takeWhile = (...[pred, coll]) =>{
  if (!coll) return coll => takeWhile(pred, coll);  
  let index = coll.findIndex(val => !pred(val))
  return index === -1 ? coll : coll.slice(0, index);
}

var nth = (...[coll, index]) =>{
  if(!index) return (index) => nth(coll, index);
  return coll[index];
}

var rest = (coll) => coll.slice(1);

var nthrest = (...[coll, n]) =>{
  if(!n) return (n) => nthrest(coll, n);
   return coll.filter((_, i) => i >= n)
}

var drop = (...[n, coll]) => {
  if(!coll) return (coll) => drop(n, coll);
  return coll.slice(n);
}

var dropLast = (coll) => { return coll.slice(0, -1); }

var dropWhile = (pred, coll) => {
  let index = 0;
  while (index < coll.length && pred(coll[index])) { index++;  }
  return coll.slice(index);
};

var peek = (coll) => coll[coll.length - 1];

var pop = ([f,...coll]) => coll

var get = (...[map, key]) =>{
  if(!key) return (key) => map[key];
  return map[key];
}

var getIn = (...[m, ks, notFound=undefined]) =>{
  if(!ks) return (ks) => getIn(m, ks);
  return ks.reduce((acc, key)=>{
    if(acc && typeof acc === 'object' && key in acc) return acc[key];
    return notFound;
  }, m);
}

var assoc = (...[m, key, val]) => {
  if(!key && !val) return (key, val) => assoc(m, key, val);
  if(!val) return (val) => assoc(m, key, val);
  if(isMap(m)) return {...m, [key]: val};
  if(isColl(m)){
    let coll = [...m];
    return (coll[key] = val ,coll);
  }
}

var assocIn =(...[m, ks, v]) => {
  if(!ks || !v) return (ks, v) => assocIn(m, ks, v);
  if(!v) return (v) => assocIn(m, ks, v);
  let keys = Array.isArray(ks) ? ks : [ks];
  let [fk, ...rk] = keys;
  let val = rk.length === 0 ? v : assocIn(m[fk] || {}, rk, v);
  return assoc(m, fk, val);
}

var dissoc = (...[m, ...keys]) => {
  if(!keys || keys.length === []) return (...keys) => dissoc(m, ...keys);
  let coll = isMap(m) ? {...m} : [...m];
  return (keys.map(key => delete coll[key]), (isMap(m) ? coll : coll.filter(f => f !== null)));
}

var update = (...[m, k, fn]) =>{
  if(!k || !fn) return (k, fn) => update(m, k, fn);
  if(!fn) return (fn) => update(m, k, fn);
  if(Array.isArray(m)){
    let coll = [...m];
    return (coll[k]= fn(coll[k]), coll);
  }
  return {...m, [k]: fn(m[k]) };
}

var updateIn = (...[m, ks, fn]) =>{
  if(!ks || !fn) return (ks, fn) => updateIn(m, ks, fn);
  if(!fn) return (fn) => updateIn(m, ks, fn);
  let [k, ...rk] = ks;
  return (rk.length === 0)
    ? update(m, k, fn)
    : update(m, k, (v) => updateIn(v, rk, fn));  
}

var merge = (...[m, ...rest]) => {
  if(!rest || rest.length === 0) return (...rest) => merge(m, ...rest);
  return Object.assign({}, m, ...rest);
}

var mergeWith = (...[fn, ...maps]) => {
  if(!maps || maps.length === 0) return (...maps) => mergeWith(fn, ...maps);
  let [m, ...coll ] = maps;
  let newMap =  Object.assign({}, m, ...coll );
  return Object.entries(newMap).reduce((acc, [k, v])=> (acc[k] = fn(v), acc),{});
}

var selectKeys = (...[m, ks]) =>{
  if(!ks) return (ks) => selectKeys(m, ks);
  return Object.fromEntries(Object.entries(m).filter(([key, value]) => ks.includes(key)));
}

var renameKeys = (...[m, ksmap]) => {
  if(!ksmap) return (ksmap) => renameKeys(m, ksmap);
  return Object.entries(m).reduce((acc, [key, value]) => ksmap[key] ? { ...acc, [ksmap[key]]: value } : { ...acc, [key]: value }, {});
}

var zipmap = (...[ks, vals]) =>{
  if(!vals) return (ks) => zipmap(ks, vals);
  return ks.reduce((acc, key, i)=> (acc[key]=vals[i], acc), {});
}

// todo: fix into add xform
var into= (...[to, from]) =>{
  if(!from) return (from) => into(to, from);
  if(isMap(to)) return from.reduce((acc, [key, value])=> ({...acc, [key]:value}),{});
  return Object.entries(from).map(([key, value]) => [key, value]);
}

var seq = (coll) =>{
  if(Array.isArray(coll)) return coll;
  if(typeof coll === 'object') return Object.entries(coll);
  if(typeof coll === 'string') return Array.from(coll);
  return coll;
}

var vec = (coll) =>{
  if (!coll) return [];
  if (Array.isArray(coll)) return coll;
  if (typeof coll === 'string') return coll.split('');
  if (typeof coll[Symbol.iterator] === 'function') return Array.from(coll);
  return Object.values(coll);
}

var subvec = (...[v, start, end]) => {
  if(!end) end = v.length;
  if(start < 0 || end < 0) return null;
  return v.slice(start, end);
}

var repeat = (...[n, x]) =>{
  if(!x) return (x) => repeat(n, x);
  return Array(n).fill(x);
}

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

// todo: fix args
var range = (...args)  =>{
  let [start, end, step=1] = args
  if (args.length === 1) (end = start, start = 0);
  let result = [];
  for (let i = start; i < end; i += step) { result.push(i);  }
  return result;
}

var keep = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr)=>{
    let res = f(curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
}

var keepIndexed = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr, i)=>{
    let res = f(i, curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
}

//TODO: fix split reg
var split = (...[p, ch]) => {
  if(!ch) return (ch) => split(p, ch);
  return p.split(ch);
}

var splitAt = (...[n, coll])=>{
  if(!coll) return (coll) => splitAt(n, coll);
  return [coll.slice(0, n), coll.slice(n)];
}

var splitWith = (pred, coll) => {
  let index = coll.findIndex(element => !pred(element));
  if (index === -1) {
    return [coll, []];
  }
  return [coll.slice(0, index), coll.slice(index)];
};

var splitLines =(str) => {
  return str.split("\n");
}

var shuffle = (coll) => {
  let result = coll.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

var randNth = (coll) => {
  let i = Math.floor(Math.random() * coll.length);
  return coll[i];
};

var rand = () => Math.random();

var randInt = (max=100) => {
  return Math.floor(Math.random() * max);
}

var find = (...[map, key]) => {
  if(!key) return (key) => find(map, key);
  return Object.entries(map).find(([k, v])=> k === key);
}

var map = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map(f);

var mapcat = (...[f, ...coll]) => {
  if(!coll || coll.length === 0) return (...coll) => mapcat(f, ...coll);
  return coll.flat().map(f).reduce((acc, val) => acc.concat(val), [])
}

var mapIndexed = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map((val, idx)=> f(val, idx));

var filter = (...[pred, coll]) => (!coll) ? (coll) => filter(pred, coll) : coll.filter(pred);

var remove = (...[pred, coll]) => {
  if(!coll) return (coll) => remove(pred, coll);
  return coll.filter(item => !pred(item));
}

var isEvery = (...[pred, coll]) =>{
  if(!coll) return (coll) => isEvery(pred, coll);
  return coll.every(pred, coll);
}

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

var flatten = (x) => x.flat();

var reduce = (...args) => {
  let [f, val, coll] = args;
  if(args.length === 1) return (coll) => reduce(f, undefined, coll);
  if(args.length === 2) return (coll) => reduce(f, val, coll);
  return coll.reduce(f, val);
}

var sort = (...args) => {
  let [arr, comp = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comp);
}

// todo: fix keyFn comp
var sortBy=(...args) =>{
  let [fn, coll] = args;
  if (args.length === 1) {
    return coll => [...coll].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...coll].sort((a, b) => fn(a) - fn(b));
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

var reverse = (coll) => [...coll].reverse();

// TODO: fix multi collection
var interleave = (...args) => {
  let [c1, c2, ...colls] = args;
  if(args.length === 2) return c1.map((v, i) => [v, c2[i]]).flat();
}

var interpose = (...args) => {
  let [sep, coll] = args;
  if (args.length === 1) {
    return coll => coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } else {
    return coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } 
}

var distinct = (coll) => [...new Set(coll)];

var groupBy = (...[f, coll]) =>{
  if(!coll) return (coll) => groupBy(f, coll);
  return coll.reduce((acc, curr) => {
    let key = f(curr);
    if(!acc[key]) (acc[key]=[]);
    return (acc[key].push(curr), acc);
  }, {});
}

var frequencies = (coll) => {
  let freqMap = new Map();
  for (const el of coll) { freqMap.set(el, (freqMap.get(el) || 0) + 1);  }
  return Object.fromEntries(freqMap);
}

// todo: multi arity arguments, step, and so on
var partition=(...args) =>{
  let [n, coll] = args;
  if(args.length === 1) return (coll) => partition(n, coll);
  let result = [];
  for (let i = 0; i < coll.length; i += n) { result.push(coll.slice(i, i + n));  }
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

// TODO: more args
var union = (...args) => {
  let [s1, s2, ...sets] = args;
  return (args.length == 1) ? (s2, ...sets) => union(s1, s2, ...sets) : Array.from(new Set([...s1, ...s2, ...sets]));
}

// TODO: more arguments sets
var difference =(...args) => {
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => difference(s1, s2, ...sets);
  return s1.filter((x) => !s2.includes(x)); // TODO: more args
}

// TODO: more arguments sets
var intersection = (...args) =>{
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => intersection(s1, s2, ...sets);
  return s1.filter((x) => s2.includes(x));
}

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

// todo: add ore args, timout-ms timout-val
var deref =(atom) => {
  if(!atom.deref) return null;
  return atom.deref();
}

var reset = (...args) => {
  let [atom, value] = args
  if(args.length === 1) return (value) => atom.reset(value);
  return (atom.reset(value), atom.deref());
}

var swap = (...args) => {
  let [atom, fn, ...rest] = args;
  if(args.length === 1) return (fn, ...rest) => atom.swap(fn, ...rest);
  return (atom.swap(fn, ...args), atom.deref());
}

var compareAndSet = (...args) => {
  let [atom, expected, newVal] = args;
  if(args.length === 1) return (expected, newVal) => atom.compareAndSet(expected, newVal);  
  return  atom.compareAndSet(expected, newVal);
}

var addWatch = (...args)=> {
  let [atom, name, watcherFn] = args;
  if(args.length === 1) return (name, watcherFn) => atom.addWatch(name, watcherFn);
  return (atom.addWatch(name, watcherFn));
}

var removeWatch = (...args) => {
  let [atom, watcherFn] = args;
  if(args.length === 1) return (watcherFn) => atom.removeWatch(watcherFn);
  return atom.removeWatch(watcherFn);
}

var setValidator = (...args) => {
  let [atom, validatorFn] = args;
  if(args.length === 1) return (validatorFn) => atom.setValidator(validatorFn);
  return atom.setValidator(validatorFn);
} 

 module.exports = {partial, apply, comp, constantly, identity, fnil, memoize, complement, juxt, sameFn, partialRight, threadLast, or, and, doseq, dof, isGt, isGte, isLt, isLte, isEqual, isZero, isPos, isNeg, isInt, isBoolean, isTrue, isFalse, isInstance, isNil, isSome, isFn, isBlank, isNumber, isEven, isOdd, isColl, isVector, isMap, isEmpty, not, isContains, isIncludes, threadf, threadl, cond, condp, condtf, condtl, when, whenNot, iff, ifNot, casef, add, subtract, multiply, divide, quot, mod, rem, inc, dec, decr, max, min, toInt, subs, replace, replaceFirst, join, escape, rePattern, reMatches, capitalize, lowerCase, upperCase, trim, trimNewline, triml, trimr, char, keys, vals, count, conj, cons, disj, concat, first, ffirst, second, last, next, nfirst, nnext, fnext, take, takeNth, takeLast, takeWhile, rest, nthrest, drop, dropLast, dropLasy, dropWhile, peek, pop, get, getIn, assoc, assocIn, dissoc, update, updateIn, merge, mergeWith, selectKeys, renameKeys, zipmap, into, seq, vec, subvec, repeat, repeatedly, range, keep, keepIndexed, split, splitAt, splitWith, splitLines, shuffle, shufle, randNth, rand, randInt, find, map, mapcat, mapIndexed, filter, remove, isEvery, everyPred, flatten, reduce, sort, sortBy, compare, reverse, interleave, interpose, distinct, groupBy, frequencies, partition, partitionBy, partitionAll, union, difference, intersection, atom, deref, reset, swap, compareAndSet, addWatch, removeWatch, setValidator, isArray, isObject };