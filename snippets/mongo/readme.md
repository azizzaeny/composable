mongodb wrapper

```js

var first = (seq) => seq[0];
var rest = (seq) => seq.slice(1);
var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}

var mongodb = require('mongodb');

var createDb = (uri, name="mongodb") => {
  let client = new mongodb.MongoClient(uri);
  return {
    [name]: {
      uri,      
      client
    }    
  }
}

var connectDb = (ctx, name="mongodb")=>{
  return ctx[name].client.connect();
}

var disconnectDb = (name) =>{
  return ctx[name].client.close();
}

var clientDb = (ctx, name="mongodb") => {
  return ctx[name].client;
}

var db = (nameDb, client) =>{
  return client.db(nameDb);  
}

var coll = (nameDb, coll, client) => {
  return db(nameDb, client).collection(coll);    
};

var find = (spec, client) => {
  return coll(spec.db, spec.coll, client).find(spec.where).toArray();
}


var query = (spec, client)=>{
  return coll(first(spec).$db, first(spec).$coll, client).aggregate(rest(spec)).toArray();  
}

var extendSyntax = ({upsert}) => {
  return (op, i) => { // map 
    let [[key, value]] = Object.entries(op);    
    let operation = {
      "$create" : {
	    insertOne: {
	      document: value
	    }
      },
      "$update": {
	    updateOne:{
	      filter: value.$match,
	      update: value.$set,
	      upsert: upsert
	    }
      },
      "$updateMany": {
	    updateMany:{
	      filter: value.$match,
	      update: value.$set
	    }
      },
      "$delete":{
	    deleteOne: {
	      filter: value.$match
	    }
      },
      "$deleteMany":{
	    deleteMany:{
	      filter: value.$match
	    }
      }
    };    
    if(operation[key]){
      return operation[key];    
    }
    return operation;
  }
}

var write = (spec, client)=>{
  let operation = map(extendSyntax({upsert: spec.upsert}), rest(spec));
  return coll(first(spec).$db, first(spec).$coll, client).bulkWrite(operation);
}

```

in use

```js
process.env.MONGODB_URI="mongodb://user:mongopass@51.255.87.159:47000/test?authSource=admin&tls=false";

var ctx = createDb(process.env.MONGODB_URI);
connectDb(ctx).then(() => console.log('Connected')).catch(err => console.log("err", err));

ctx.mongodb.client.db('tutorial').collection('movies');

var client = clientDb(ctx);

db("test", client);

coll("test", "tutorial", client).find({}).toArray().then(console.log);
coll("test", "foo", client).find({}).toArray().then(console.log);

find({
  db: "test",
  coll: "tutorial",
  where: {}
}, client).then(console.log);

query([
  {$db: "test", $coll: "tutorial"},
  {$match: {}},
  {$project: {_id: 0, title: 1}},
  {$limit: 10}
], client).then(console.log);

query([
  {$db: "test", $coll: "tutorial"},
  {$group:{_id: null, total: {$sum: 1}}}
], client).then(console.log);

write([
  {$db: "test", $coll: "tutorial"},
  {$create: {title: "why this is happen", description: "Just tutorial", published: false}}  
], client).then(console.log);


```
