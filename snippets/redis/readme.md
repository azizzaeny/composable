Functional programming utility dealing with redis

### Files
- [util.js](./util.js)

### Usage
```javascript

process.env.REDIS_URL ="redis://user:pass@127.0.0.1:6679";

var ctx = createRedis({ url: process.env.REDIS_URL });
var client = getClient(ctx); // or ctx.redis 

connectRedis(ctx)
  .then(()=> console.log('redis connected'));

reader(['xreadgroup', 'stream', 'group1', 'consumer1', '100', '0', '0'], (data)=> console.log(data), client);
reader(['xread', 'stream', '100', '0', '0'], (data)=> console.log(data), client);

command(['xadd', 'stream', {data: '1'}], client)
command(['xadd', 'stream', ['data', '1']], client);
command(['json.get', 'foo', '$.data'], client).then(console.log)
command(['json.set', 'foo', {data: 1}], client).then(console.log);
command(['json.mget', 'foo', 'bar', '$'], client).then(console.log);

var streamRead = reader(['xread', 'stream', '100', '0', '0'], (data)=> console.log(data), client);
streamRead.close(); // to close blocking

```
