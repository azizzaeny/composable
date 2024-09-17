## @zaeny/mongodb

[![npm version](https://img.shields.io/npm/v/@zaeny/mongodb.svg)](https://www.npmjs.com/package/@zaeny/mongodb)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/mongodb.svg)  

> Mongodb utility pure functions

Wrap mongodb node.js driver so it expose only two main function `query` and `transact`, so you can seperate pure function in domain business and side-effect (avoiding not dot notation call)

- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)

### Getting started 

```sh
npm i @zaeny/mongodb
```

### Usage 

```js
process.env.MONGODB_URI="mongodb://mongouser:mongopass@localhost:27017/test?authSource=admin&tls=false";

var {createDb, connectDb, query, transact} = require('@zaeny/mongodb');

var clientDb = createDb(process.env.MONGODB_URI);

connectDb(clientDb)
  .then(()=> console.log('mongodb connected');

var db => clientDb;

find({
  $db: "test",
  $coll: "tutorial",
  $where: {_id: 1}
}, db).then(console.log);

query([
  {$db: "test", $coll: "tutorial"},
  {$match: {}},
  {$project: {_id: 0, title: 1}},
  {$limit: 10}
], db).then(console.log);

query([
  {$db: "test", $coll: "tutorial"},
  {$group:{_id: null, total: {$sum: 1}}}
], db).then(console.log);

transact([
  {$db: "test", $coll: "tutorial"},
  {$create: {title: "why this is happen", description: "Just tutorial", published: false}}  
], db).then(console.log);
```

in the query the first query is always select database and collection by defining `$db` and `$coll`

```js
{$db: "test", $coll: "tutorial"},
```
the rest of it is aggregate function to getting the data
```js
...,
{$match: {_id: 1}},
{$sample:{size: 10}},
...
```

then we can implement onion architecture to seperate side-effect and the main core business

```js
// core pure
var findUserByUsername = (username) => [
  {$db: 'my_db', $coll: 'story'},
  {$match:{ username }},
  {$limit: 1}
];

// controller api
await query(findUserByUsername(req.query.username), db);
```
inserting bulk, updating and deleting data with this api 
`$create`, `$update`, `$updateMany`, `$delete`, `$deleteMany`

example of usage transacting

```js
...,
{$create: {title: "why this is happen", description: "Just tutorial", published: false}}
{$update: {
  $match: {title:/why/},
  $set: { updated_at: Date.now() }
}},
{$delete: {
  $match: {_id: 1}
}}
```

### API
```js
 createDb,
 connectDb,
 getDb,
 coll,
 find,
 query,
 find,
 transact
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
 - [1.0.0] add `query` and `transact`
 - [1.0.1] fix bugs `transact` allow operation default
 - [1.1.1] breaking changes `transact` now instead of `$set` `$set` it work on top operation
