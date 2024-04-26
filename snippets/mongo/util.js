
var first = (seq) => seq[0];
var rest = (seq) => seq.slice(1);
var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}
var isFn = (value) => typeof value === 'function';

var mongodb = require('mongodb');

var createDb = ({url}, name="mongodb") => {
  let client = new mongodb.MongoClient(url);
  return {
    [name]: {
      url,      
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

var clientDb = (ctx, name="mongodb") => () => {
  return ctx[name].client;
}

var getDb = (nameDb, client) =>{
  return client.db(nameDb);  
}

var coll = (nameDb, coll, client) => {
  return getDb(nameDb, client).collection(coll);    
};

var find = (spec, client) => {
  if(isFn(client)) (client=client());  
  return coll(spec.db, spec.coll, client).find(spec.where).toArray();
}

var query = (spec, client)=>{
  if(isFn(client)) (client=client());  
  return coll(first(spec).$db, first(spec).$coll, client).aggregate(rest(spec)).toArray();  
}

var extendOperation = ({upsert}) => {
  return (op, i) => { // map  array
    let [[key, value]] = Object.entries(op);    
    let operation = {
      "$create" : { insertOne: { document: value } },
      "$update": { updateOne:{ filter: value.$match, update: value.$set, upsert: upsert }},
      "$updateMany": { updateMany:{ filter: value.$match, update: value.$set } },
      "$delete":{ deleteOne: { filter: value.$match } },
      "$deleteMany": { deleteMany: { filter: value.$match } }
    };
    if(operation[key])return operation[key];
    return operation;
  }
}

var transact = (spec, client)=>{
  if(isFn(client)) (client=client());
  let operation = map(extendOperation({upsert: spec.upsert}), rest(spec));
  return coll(first(spec).$db, first(spec).$coll, client).bulkWrite(operation);
}
/*
process.env.MONGODB_URI="mongodb://mongouser:mongopass@localhost:27017/test?authSource=admin&tls=false";

var ctx = createDb(process.env.MONGODB_URI);

connectDb(ctx).then(() => console.log('Connected')).catch(err => console.log("err", err));

// raw access
ctx.mongodb.client.db('tutorial').collection('movies');

var client = clientDb(ctx);

getDb("test", client());

coll("test", "tutorial", client()).find({}).toArray().then(console.log);
coll("test", "foo", client).find({}).toArray().then(console.log);

 */
