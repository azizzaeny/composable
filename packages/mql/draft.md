specifications

```js 
loadFile('./draft.md');
loadFile('../clojure.core/draft.md')
```
its need the clojure.core

```js evaluate=1

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

function aggregate(coll, stages, db=getDatabase()){
  return reduce((acc, stage)=>{
    if(stage.$match){
      return handleMatchStage(acc, stage);
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
