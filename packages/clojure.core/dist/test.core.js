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
var core = require('./core');
Object.assign(global, core);

test('should get object',()=>{
  let obj = {a: 1};
  assert.equal( get(obj, 'a'), 1);
});

test('should get object curried', ()=>{
  let obj = {a:1};
  let getObj = get(obj);
  assert.equal( getObj('a'), 1)
});

test('should getIn nested path', ()=>{
  let obj = {a: {b: {c: 1}}};
  assert.equal(getIn(obj, ['a', 'b', 'c']), 1)
})

test('should getIn with curry args', ()=>{
  let obj = {a: {b: {c: 10}}};
  let getObj = getIn(obj);
  assert.equal(getObj(['a','b','c']), 10)
});

test('should assoc key value', ()=>{
  let obj = {a:1};
  assert.deepEqual(assoc(obj, 'b', 20), {a:1, b:20})
});

test('should dissoc key', ()=>{
  let obj = {a:1, b:2};
  assert.deepEqual(dissoc(obj, 'a'), {b:2})
});

test('should udpate object given key and functions ', ()=>{
  let obj = {a: 1, b: 2};
  let inc = (val) => val + 1;
  let res = update(obj, "b", inc);
  assert.deepEqual(res, {a: 1, b: 3});
});

test('should assoc in path given value', ()=>{
  let obj = {a: 1, b:{c: 10}};
  let res = assocIn(obj, ['b', 'c'], 20);
  assert.deepEqual(res, {a:1, b:{c: 20}});
});

test('should updateIn path, uppercase full name', ()=>{
  let obj = {name:{ full_name: "aziz zaeny"}};
  let upperCase = (val) => val.toString().toUpperCase();
  let path = ["name", "full_name"];
  let res = updateIn(obj, path, upperCase);
  let fullName  = getIn(res, path);
  assert.equal(fullName, "AZIZ ZAENY");
})

test('should merge more maps or object', ()=>{
  let obj1 = {a:1}
  let obj2 = {a:11, b:2};
  let obj3 = {c:32}
  let res = merge(obj1, obj2, obj3);
  assert.deepEqual(res, {a:11, b:2, c:32})
});

test('should test merge with function', ()=>{
  let obj1 = {a:1, b: 0};
  let obj2 = {a:2, b: 2};
  let sum = (a, b) => a + b;
  let inc = (val) => val + 1;  
  let res = mergeWith(inc, obj1, obj2);
  assert.deepEqual(res, {a:3, b:3})
})

test('should return selected keys', ()=>{
  let obj = {a:1, b:2, c:3, d:4};
  let res = selectKeys(obj, ['b', 'c']);
  assert.deepEqual(res, {b:2, c:3})
});

test(' should rename key b to c', ()=>{
  let res = renameKeys({a: 1, b:2}, {"b": "c"});
  assert.deepEqual(res, {a:1, c:2});
});

test('get keys of objects', ()=>{
  assert.deepEqual(keys({a:1, b:2}), ['a','b'])
})

test('should get vals of objects', ()=>{
  assert.deepEqual(vals({a:1, b:2}), [1,2])
})

test('should zipmap given arrays of keys and values', ()=>{
  assert.deepEqual(zipmap(['a', 'b'])([1,2]), {a:1, b:2})
});

test('count coll', ()=>{
  assert.equal(count([1,2]),2)
})

test('test conj single', ()=>{
  assert.deepEqual(conj(['a'], 'a'),['a','a'])
});

test('test conj array', ()=>{
  assert.deepEqual(conj(['a', 'b'], ['c']),['a', 'b', ['c']])
})

test('test multiple conj', ()=>{
  assert.deepEqual(conj(['a'], 'b', 'c'),['a', 'b', 'c'])
});

test('cons array', ()=>{
  assert.deepEqual(
    cons(0,[1,2,3]),
    [0,1,2,3]
  )
})

test('test first array', ()=>{
  assert.equal(first([1,2]),1)
})

test('first of first of arrays', ()=>{
  assert.deepEqual(ffirst([[0, 1], [1,2]]),0)
});

test('nth index of collections', ()=>{
  assert.equal(nth([1,2,3,4], 2), 3)  
})

test('should test the conversion of object', ()=>{
  assert.deepEqual(seq({a:1, b:2}), [["a", 1], ["b", 2]]);
});
test('should convert string into sequences', ()=>{
  assert.deepEqual(seq('aziz'), ['a', 'z','i', 'z'])
})

assert.equal(peek([1,2,3,4]), 4); // 4

assert.deepEqual(rest([1,2,3]), [2,3])

assert.deepEqual(pop([1,2,3]), [1,2])

assert.deepEqual(disj([1,2, 3],1), [2,3])

assert.deepEqual(takeNth(2,[1,2,3,4,5,6,7,8]), [1,3,5,7])
assert.deepEqual(takeNth(3, [1,2,3,4,5,6,7,8]),[1,4,7])

assert.deepEqual(take(2, [1,2,3,4,5,6,7,8]), [1,2])

assert.deepEqual(second([1,2]), 2)

assert.deepEqual(last([1,2,3,4,5]), 5);

deepEqual(next([1,2,3,4]), [2,3,4]);

deepEqual(nfirst([[1,2,3], [4,6,7]]), [2,3])

deepEqual(nnext([1,2,3,4]), [3,4])

deepEqual(fnext([[1,2,3], [4,5,6]]), [4,5,6]);

deepEqual(takeLast(2, [1,2,3,4,5,6,7]), [6,7])
deepEqual(takeLast(3)([1,2,3,4,5,6]), [4,5,6])

deepEqual(takeWhile((n)=> n < 5, [1,2,3,4,5,6,7,8]), [1,2,3,4])

deepEqual(nthrest(2, [1,2,3,4,5,6]), [3,4,5,6])

deepEqual(drop(2, [1,2,3,4,5]), [3,4,5])

deepEqual(dropLast([1,2,3,4]), [1,2,3]);

splitAt(2, [1,2,3,4,5,6]) //[ [ 1, 2 ], [ 3, 4, 5, 6 ] ]

shuffle([1,2,3,4,5,6,7,7,8]);

randNth([1,2,3,4,5,6,7])

vec({a: 'b'})
vec('asdff')
vec([1,2,3,4,5])

subvec([1,2,3])

repeat(20)(2)

range(0, 10)

keep(n=>{
  if(n % 2 ===0){
    return n
  }
}, range(0,10))

keepIndexed((n,i)=>{
  if(i % 2 ===0){
    return n
  }
}, range(0,10))

find(n=> n === 2, [1,2,3,4,5,6])
find(n=> n === 7, [1,2,3,4,5,6])

map(n=> n*2, [12,13,14,15,16]);

filter(n=> n > 2)([1,2,3,4,5,6])

var isEven = n => n % 2 === 0;
var numbers = [1, 2, 3, 4, 5, 6];
var result = remove(isEven, numbers);

every(n => n > 0, [1,2,3,4,5])
every(n => n > 0, [0, 1,2,3,4,5])

reduce((acc,v) => acc + v, 0, [1,23,4,5,6,77])

concat([1,2,3,4], [5,6,7,8])

mapcat(x => [x, x * 2], [1,2,3,4])

mapIndexed((n, i) => [n, i], [1,2,3,4,5])

flatten([1,2,[3,4],[[1,2,3,4]]])

distinct([1,2,1,2,4,5,6,6,7,6,8])

interleave([1,2,3], ["a", "b","c"]) // []
zipmap([1,2,3], ["a", "b","c"]); // {}

interpose(",", ["one", "two", "three"])

reverse([0,1,2,3])

sort([1,2,3,4,5,6,5,4,1])

sortBy((n)=> n.length, ["aaa", "bb", "c"])

compare(1, 2)

groupBy(n => n > 0)([-1,2,3,4,5, -9,-2]);

partition(4, [1,2,3,4,5,6,7,8,9])

partitionAll(4, [1,2,3,4,5,6,7,8,9]);

partitionBy(n => n % 2 !== 0)([1,1,1,1,2,2,2,3,3,3,4,4,5])

frequencies([1,1,1,2,2,2,3,4,5,6,7,8,8]);

union([1,2,3,4,5], [1,2,3,8,9]);

difference([1,2,3,4,5], [0, 3, 5,6]); // 1,2,4

assert.equal(intersection([1,2], [2,3]), 2)

apply(get, [{a: 1}, "a"])

var addTwo = (x) => x + 2;
var square = (x) => x * x;
var doubleIt = (x) => x * 2;
var fns = comp(addTwo, square, doubleIt);
fns(3);

map(constantly(10), [1,2,3,4,5])

map(identity, [1,2,3,4,5,6])

let sayhello = fnil((name) => "Hello " + name, "Sir")
sayhello('aziz')
sayhello(); // default

var myfn = (a) => (console.log('hai'), (a+1));
var memofn = memoize(myfn)
memofn(1); // print hai
memofn(1)
memofn(2); // print hai
memofn(2)

everyPred(n => n > 0, n => n> 1)(2)
everyPred(n => n > 0)(1)

var empty = (arr) => arr.length === 0;
var isNotEmpty = complement(empty);
isNotEmpty([]);

var sumit = (a,b) => a + b;
map(partial(sumit, 10), [1,2,3,4]);

juxt((n)=> n*2, (n)=> n + 10, (n)=> n*100)(10) //  [20, 20, 1000]

someFn((n) => n % 2 === 0)(2)

var myfn1 = (a, b, c, d) => a + b + c + d;

var newFn = partialRight(myfn1, 'a', 'z', 'i');
newFn('z')

var myfn2 = (a,b,c,d) => a + b + c + d;
var newFn = partialLeft(myfn2, 'a', 'z', 'i');
newFn('z');
var foo = (a) => 'Mr. '+a;

thread(
  22,
  (x) => x * 10,
  (x) => x +5
)

thread([22,10], map(x => x *10), map (x => x +5))

condThread(
  5,
  (x) => x > 0, (x) => x * 2,
  (x) => x < 10, (x) => x + 1,
  (x) => x % 2 === 0, (x) => x / 2
);

isNotEmpty([])

isEmpty([])

isContains([1,2,3,4], 2)
isContains({a:1, b:2}, "b")
isContains('foo', 'o')

isIncludes('foo', 'o')

isZero(0)

isPos(-1)

isNeg(-1)

isEven(0)

isOdd(0)

isInt(10)

isTrue({})

isFalse(false)

isInstanceOf([],Array);
isInstanceOf([], Object)

isNil(null)

isSome(null)
isSome('a')
isSome(1)

isFn(()=>1)

isBlank("")
isBlank([])
isBlank(null)
isBlank(undefined)

isArray([])

isNumber(1)

isObject([])
isObject({})

isString("")

isIdentical(1, 1)

isEqual('a','a')

isColl({})
isColl([])

isNotEqual(1,2)

isGt(1,2)

isGte(1,2)

isLt(1,2)

isLte(1,2)





isDistinct([1,2,2])
isDistinct([1,2,3])

isEveryEven([0, 2])

isNotEveryEven([0,2])

isNotAnyEven([1])

isDeepEqual({a:1, b:{c:1}}, {a:1, b:{c:1}})

rand()

randInt(5)

add(1,2)

subtract(20,10)

multiply(10, 1)

divide(100, 10)

quot(100, 3)

mod(2,2)
mod(1, 2)
mod(1, 3)

rem(10, 20)

incr(10)

decr(10)

max(0, 100)

min(0, 20)

toInt("100")
toInt(100)

toIntSafe(10)

subs("foo", 0, 2); //fo

splitLines("hello\nworld"); // ["hello", "world"]

replace("hello world", "o", "a"); // "hella warld"

replaceFirst("hello world", "o", "a"); // "hella world"

join(["hello", "world"], " "); // "hello world"

escape("hello.world"); // "hello\.world"

rePattern("hello.*");

reMatches("hello world", "l+"); // ["ll"]

capitalize("hello world"); // "Hello world"

lowerCase("HELLO WORLD"); // "hello world"

upperCase("hello world"); // "HELLO WORLD"

trim("   hello world   "); // "hello world"

trimNewLine('\nhello\nworld\n')

trimL('\nfoo')

trimR('foo\n')

char(56);

var s = atom(10);
s.deref()
s.reset(20);
s.swap(value => value * 2);
s.addWatch("logger", (oldState, newState) => console.log(`State changed from ${oldState} to ${newState}`));
s.addWatch("alert", (oldState, newState) => console.log(`State changed from ${oldState} to ${newState}`));
s.removeWatch("logger"); // Remove the "logger" watch function
s.setValidator(newValue => newValue > 0);
s.removeValidator()
s.reset(-20);
s.compareAndSet(-20, 20)
s.compareAndSet(-20, 20)
s.deref();

reset(s, 100);

swap(s, (n)=> n - 10)

compareAndSet(s, 90, 200)
deref(s);

addWatch(s, 'foo', (n, o) => console.log(n,o));
reset(s, 100);

removeWatch(s, "foo");

setValidator(s, (n)=> n >0);
reset(s, 100)
reset(s, 0)
s.deref()

removeValidator(s)