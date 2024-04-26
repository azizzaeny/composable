mongodb core domain, wrapper mongodb utility to make it easy dealing with onion architecture or clean architecture
where we specify core domain logic as an array manipulation instead side-effect functions call  

### Files

- [util.js](./util.js)

### Usage
in use

```js
process.env.MONGODB_URI="mongodb://mongouser:mongopass@localhost:27017/test?authSource=admin&tls=false";

var ctx = createDb({ url: process.env.MONGODB_URI});
connectDb(ctx);

var client = clientDb(ctx);

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

transact([
  {$db: "test", $coll: "tutorial"},
  {$create: {title: "why this is happen", description: "Just tutorial", published: false}}  
], client).then(console.log);


```
