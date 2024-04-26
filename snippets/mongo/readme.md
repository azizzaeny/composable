mongodb wrapper

```js

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
  return coll(spec.db, spec.coll, client).aggregate(spec.where).toArray();  
}

var write = (spec, client)=>{
  return coll(spec.db, spec.coll, client).bulkWrite(spec.where);
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


query({
  db: "test",
  coll: "tutorial",
  where: [
    {$match: {}},
    {$project: {_id: 0, title: 1}},
    {$limit: 10}
  ]
}, client).then(console.log);


write({
  db: "test",
  coll: "tutorial",
  where: [
    {insertOne: { document: {title: "new Ones", description: "just tutorial", published: false}}},
    {insertOne: { document: {title: "new Ones", description: "just tutorial", published: false}}}    
  ]
}, client).then(console.log);

```
