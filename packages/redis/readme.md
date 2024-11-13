## @zaeny/redis

[![npm version](https://img.shields.io/npm/v/@zaeny/mongodb.svg)](https://www.npmjs.com/package/@zaeny/redis)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/redis.svg)  

> Redis functions 

wrap redis node.js driver expose command function and parse returned if json command specific

- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)


### Getting Started

```sh
npm i @zaeny/redis
```

### Usage
parsing json data automaticly, both input json and output json
```js
process.env.REDIS_URL="redis://redisuser:redispass@127.0.0.1:6379"

var client = createRedis(process.env.REDIS_URL);
connectRedis(client)

  
command(['ping'], client).then(console.log)
command(['json.get', 'foo', '$.data'], client)
command(['json.set', 'foo', '$', {data: 1}], client)
command(['json.mget', 'foo', 'bar', '$'], client)
```

blocking read and stream reading

```js
reader(['xreadgroup', 'mystream', 'group1', 'consumer1', '100', '0', '0'], (data)=> console.log(data), rs);
reader(['xread', 'mystream', '100', '0', '0'], (data)=> console.log(data), rs);

command(['xadd', 'mystream', {data: '1'}], rs)
command(['xadd', 'mystream', ['data', '1']], rs);  
```

closing stream 

```js
var mystream = reader(['xread', 'mystream', '100', '0', '0'], (data)=> console.log(data), rs);
mystream.close();
```

add acknowledge
```js
// ack([streamId]);
var processStream = ((data, ack) =>{
  ack(map(first, data));
  console.log(data);
}                     
reader(['xreadgroup', 'mystream', 'group1', 'consumer1', '100', '0', '0'], processStream, rs);
```

var mystream = reader(['xread', 'mystream', '100', '0', '0'], (data)=> console.log(data), rs);
### API

```js
createRedis,
connectRedis,
command,
reader,
parsePair,
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
 - [1.0.0] add `command` and basic parsing json
 - [1.0.1] add blocking `reader` to support basic `xread` and `xreadgroup`
 - [1.0.2] add `parsePair` parsing tupple return from redis into object js
 - [1.0.3] fix `parsePair` `isEven` is not defined
 - [1.0.4] add `retry_strategy` reconnecting, add `tfload`, `tfcall`
 - [1.0.5] fix json.get return array 
 - [1.0.6] fix  multiple path `$.[]` at json.get
 - [1.0.7] move to new repositoy, add `xack`
 - [1.1.2] add new stream acknowledge 
 - [1.1.3] fix repository homepage
 - [1.1.4] fix the parse value for `json.mget`
 - [1.1.5] add `createClusterRedis` 
 - [1.1.6] add support `command` in cluster mode, support `isReadonly` command 
 - [1.1.7] add simple replication routing, use weight distribution 
 - [1.1.8] add fix for duplicate client for `reader` command 
 - [1.1.9] add support for sending string `command`
