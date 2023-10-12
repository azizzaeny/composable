specifications

```js 
loadFile('./draft.md');
loadFile('../clojure.core/draft.md')
```




first version
```js evaluate=0

function createDatabase(){
  return atom({})
}


var Database = Database || createDatabase();

function getDatabase(){
  return Database;
}

function resetDatabase(){
  Database = createDatabase();
}

function createCollection(coll, idx=['_id'], db=getDatabase()){
  if(!get(db.deref(), coll)){
    db.swap(function(database){
      return assoc(database, coll, {
        _name : lowerCase(coll)
        _head : idx,
        _data : {},
        _index: reduce((acc, value)=> assoc(acc, value, {}), {}, idx)
      })
    });
    return coll;
  }else{
    console.warn(`Collection "${coll}" already exists.`);
  }
  return coll;
}

function collection(coll, db=getDatabase()){
  return get(db.deref(), coll);
}

function collectionExists(coll, db=getDatabase()){
  return Boolean(collection(coll, db))
}

function getData(coll, db=getDatabase()){
  return vals(get(collection(coll, db), '_data'));
}

// TODO create update index
function updateIndex(coll, head, db=getDatabase()){
  // todo check the coll exists
  // updating index is hard without iterating each element find, fix and solve the problem
}

function documentId(doc){
  return Boolean(doc._id);
}

function insert(coll, doc, db=getDatabase()){
  if(!collectionExists(coll, db)){
    return console.warn('no collections');
  }
  if(!documentId(doc)){
    return console.warn('no document _id to be created ');
  }
  db.swap(database=>{
    let newColl =  updateIn(database, [coll], (currColl)=>{
      let newData  = assocIn(currColl, ['_data', doc._id], doc);
      let data     = get(newData, '_data'); 
      let head     = get(currColl, '_head');
      let index    = get(currColl, '_index');
      let newIndex = reduce((acc, value)=>{
        if(!acc[value]){
          return assoc(acc, value, {[doc[value]]: doc._id});
        }else{
          return assoc(acc, value, merge({}, acc[value], {[doc[value]]: doc._id}))
        }
      }, merge({},index), head);
      return merge(currColl, { _data: data, _index: newIndex});
    });
    return merge(database, newColl);
  });
  return doc._id;
}

function insertMany(coll, doc, db=getDatabase()){
  return doc.map(d=> insert(coll, d, db));
}

function batchWrite(spec){
  if(!spec || typeof spec !== "object"){
    return console.warn('unrecoginze specs');
  }
  // TODO: batchwrite
}

var operators = {
  $eq: (a,b) => a === b,
  $lte: (a, b) => a <= b,
  $gte: (a, b) => a >= b,
  $gt: (a, b) => a > b,
  $lt: (a, b) => a < b,
  $ne: (a, b) => a !== b,  
  $in: (a, b) => b.some(val => a.includes(val)),
  $nin: (a, b) => !b.some(val => a.includes(val))  
};

function matchCondition(doc, condition){
  return every(([key, value]) => {
    let nestedKey = key.split('.');
    if(isObject(value) && !isArray(value)){
      return every(([op, opValue])=>{
        if(op.startsWith('$')){
          if(operators[op]){
            return operators[op](getIn(doc, nestedKey), opValue);
          }else{
            return false; // unrecongnize;
          }
        }
        return matchCondition( getIn(doc, nestedKey), value); // recurse  
      }, seq(value))
    };
    return isEq(getIn(doc, nestedKey), value);
  }, seq(condition));
}

function handleMatchStage(data, stage){
  let condition = stage.$match; // whole conditions
  if(condition.$expr){
    throw new Error('not supported yet');
  }
  // normal condition
  return filter(doc=> matchCondition(doc, condition) , data)
}

// TODO: reuse funciton
function handleLookupStage(data, stage, db){
  const { from, as, localField, foreignField } = stage.$lookup;
  const fromCollection = db[from]._data;

  return data.map((doc)=>{
    let localVal = doc[stage.$lookup.localField];
  })
}

function aggregate(coll, stages, db=getDatabase()){
  return reduce((acc, stage)=>{
    if(stage.$match){
      return handleMatchStage(acc, stage);
    }
    if(stage.$lookup){
      return handleLookupStage(acc, stage, db.deref());
    }
    return acc;
  }, getData(coll, db) , stages)
}

```

test ground
```js 
resetDatabase()
Database.deref()
createCollection('products');
collection('products');
collectionExists('products');
insert('products', {_id: 1, name: 'bottle', price: 1.4})
insertMany('products', [
  {_id: 2, name: 'glass', price:10},
  {_id: 3, name: 'books', price: 0.2}
]);

getData('products');

aggregate('products', [{$match: {name: 'bottle'}}])
aggregate('products', [{$match: {price: {$lte: 9}}}])
aggregate('products', [{$match: {name: {$ne: 'bottle'}}}])

var doc1 = {
  quantity: 15,
  carrier: {
    fee: 10,
    details: {
      name: "FedEx"
    }
  },
  tags: ["red", "fragile"]
};

var doc2 = {
  name: "John",
  address: {
    city: "Los Angeles",
    postal: {
      code: "90001",
      area: "Downtown"
    }
  }
};

matchCondition(doc1, {quantity: 15})
matchCondition(doc1, {quantity: {$lte: 20}})
matchCondition(doc1, {quantity: {$gte: 20}})
matchCondition(doc1, { "carrier.fee": { $gt: 5 } })
matchCondition(doc1, { tags: { $in: ["red", "blue"] } })

matchCondition(doc1, { "carrier.details.name": "FedEx" })
matchCondition(doc1,  { "carrier.details": { name: "FedEx" } })
matchCondition(doc2, { "address.postal.code": "90001" })
matchCondition(doc2, { "address.postal": { area: { $ne: "Suburb" } }})
```

Second Version

```js evalaute=1

function createDatabase(){
  return atom({coll: {}, index: {}})
}

var Database = Database || createDatabase();

function getDb(db=Database){
  return db.deref();
}

function resetDb(db=Database){
  db.reset({coll: {}, index: {}});
}

function getColl(coll, db=Database){
  return getDb()['coll'][coll];
}

function createCollection(coll, args={}){
  let { db=Database, index=['_id']} = args;
  if(getColl(coll, db)) return console.log('collection already exists');
  return (db.swap((database)=> ({
    coll: { [coll] : {} },
    index: { [coll]: reduce((acc, idx)=> assoc(acc,idx, {}),{}, index) }
  })), true);
  
}

function upsert(coll, document, args={}){
  let {db=Database, index=['_id']} = args;
  if(!getColl(coll, db)) return console.log('no collection');
  if(!document._id) return console.log('no document _id');
  return (db.swap((database)=>{
    let updateData = updateIn(database, ['coll', coll], (data) => assoc(data, document._id, document));
    return updateIn(updateData, ['index', coll], (data) =>{
      return reduce((acc, value) =>{
        if(!acc[value]){
          return assoc(acc, value, {[document[value]]: document._id});
        }else{
          return assoc(acc, value, merge(acc[value], {[document[value]]: document._id}));
        }
      }, {}, keys(data))
    });
  }), true)
}

function insert(coll, document, args={}){
  let {db=Database, index=['_id']} = args;
  if (!getColl(coll, db)) return console.log('no collection');
  if (!document._id) return console.log('no document _id');
  if (getIn(db.deref(), ['coll', coll, document._id])){
    return console.log('document already exists');
  }
  return upsert(coll, document, args);
}

function getIndex(coll, index, args={}){
  let { db=Database } = args;
  if (!getColl(coll, db)) return console.log('no collection');
  return getIn(db.deref(), ['coll', coll, index]);
}

function scanIndex(coll, index, args={}){
  let { db=Database } = args;
  if ( !getColl(coll, db) ) return console.log('no collection');
  let idx = getIn(db.deref(), ['index', coll]);
  let curr = getIn(db.deref(), ['coll', coll]);
  let results = join(reduce((acc,value)=>concat(acc, `curr['${index}']`),[], keys(idx)), '||');
  return eval(results); // Todo: tricky eval
}

function getOperator(op){
  let operator = {
    $eq: (a,b) => a === b,
    $lte: (a, b) => a <= b,
    $gte: (a, b) => a >= b,
    $gt: (a, b) => a > b,
    $lt: (a, b) => a < b,
    $ne: (a, b) => a !== b,  
    $in: (a, b) => b.some(val => a.includes(val)),
    $nin: (a, b) => !b.some(val => a.includes(val))  
  };
  return operator[op];
}

function handleMatchOperator(op, opValue, nestKey, data){
  if(getOperator(op)){
    return getOperator(op)(getIn(data, nestKey), opValue);
  }else{
    return false;
  }
}

function matchOperator(data){
  return function([key, value]){
    let nestKey = key.split('.');
    console.log('getIn', nestKey);
    if(isObject(value) && !isArray(value)){
      console.log('return operator get');
      let matchValueOperator = ([op, opValue]) => {
        if(op.startsWith('$')){
          return handleMatchOperator(op, opValue, nestKey, data);
        }else{
          return false;
        }
      }
      return every(matchValueOperator, seq(value))
    }
    console.log('return normal get', data, nestKey, value);
    return isEq( getIn(data, nestKey), value);
  }
}

function $match(dataObj, stage, db){ // {$match: ...data}
  let condition = stage.$match;
  console.log('condition', condition, dataObj);
  if(condition.$expr) return 'not yet supported';
  return reduce((acc, value)=>{
    let matchEveryCondition = (condition, value) => every( matchOperator(value) , seq(condition));    
    if(matchEveryCondition(condition, value)){
      console.log('all cond is match');
      return assoc(acc, value._id, alue);
    }
    return acc;
  }, {}, vals(dataObj));
}

function aggregate(coll, stages, args={}){
  let { db=Database } = args;
  let currColl  = getIn(db.deref(), ['coll', coll]);
  let currIndex = getIn(db.deref(), ['index', coll]);
  return reduce((acc, stage) =>{
    if(stage.$match){
      let results = $match(currColl, stage, db);
      return results;
    }
    if(stage.$lookup){
      return 'not yet supported';
    }
    return acc;
  }, {}, stages);
}

resetDb()
Database.deref()
Database.deref().index
createCollection('products');

upsert('products', {_id: 1, name: 'bottle', price: 1.4});
insert('products', {_id: 1, name: 'bottle', price: 1.4});
scanIndex('products', '1');
getIndex('products', '1');

aggregate('products', [
  {$match: {_id: '1'}}
]);

```
