/* imported from @zaeny/clojure.core */
var first = (seq) => seq[0];
var second = ([_, x]) => x;
var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}
var concat=(...args)=>{
  let [arr1, ...rest] = args;
  if (args.length === 1) {
    return (...rest) => concat(arr1, ...rest);
  }
  return arr1.concat(...rest)
}
var merge = (...args) => {
  let [obj1, obj2] = args;
  if(args.length === 1) return (obj1) => merge(obj1, obj2);
  return Object.assign({}, ...args);
}
var getIn =(...args) =>{
  let [coll, keys] = args;
  if(args.length === 2){
    return keys.reduce((acc, key) =>{
      if(acc && typeof acc === "object" && key in acc){
        return acc[key];
      }else{
        return undefined;
      }
    }, coll);
  }else{
    return (keysA) => getIn(coll, keysA);
  }
}
var isGt = (a, b) => a > b;
var rest = (seq) => seq.slice(1);
var isFn = (value) => typeof value === 'function';
var isString = (value) => typeof value === 'string';
var isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
var lowerCase = (str) =>  str.toLowerCase();
var upperCase = (str) =>  str.toUpperCase();
var seq = (arg) =>{
  if(Array.isArray(arg)){
    return arg;
  }
  if(typeof arg === "object"){
    return Object.entries(arg);
  }
  if(typeof arg === "string"){
    return Array.from(arg);
  }
  return arg;
}
var flatten =(...args) => {
  let [arr, level] = args;
  if(args.length === 1){
    level = Infinity;
  }
  return arr.flat(level);
}
var pop = (stack) => stack.slice(0, -1);
var peek = (stack) => stack[stack.length - 1];
var identity = (x) => x;


var stringify = (data) => {
  return isObject(data) ? JSON.stringify(data) : (!isString(data) ? data.toString() : data);
}

var toString = (k) => k.toString();

var parseData = (data) => {
  if (isObject(data)) return map(toString, flatten(seq(data)))
  return data;
}

var commandType = {
  'json.set': (args) =>{ //todo: fix if set by integer
    let [_, entity, data, path='$' ] = args; 
    return ['JSON.SET', entity, path, stringify(data)];  
  },
  'json.get': (args) =>{
    let [_, entity, path] = args;
    return (path) ? ['JSON.GET', entity, path] : ['JSON.GET', entity];
  },
  'json.mget': (args) => {
    let path = peek(args) || '$';
    let keys = pop(rest(args));
    return concat(['JSON.MGET'], keys, path);
  },
  'ft.create': (args) => { 
    let [_, index, type, prefix, schema] = args;
    return flatten(concat([
      'FT.CREATE', index,
      'ON', upperCase(type),
      'PREFIX', '1', prefix, // TODO: fix prefix
      'SCHEMA'
    ], schema));
  },
  'ft.search': (args) => {
    let [_, index, search, options=['NOCONTENT']] = args;
    return flatten(concat([
      'FT.SEARCH',
      index,
      search
    ], options));
  },
  'xadd': (args)=> {
    let [_, key, data, length] = args;
    if(length) return concat(['xadd', key, 'maxlen', toString(length), '*'], parseData(data));
    return concat(['xadd', key, '*'], parseData(data));
  },
  'xread': (args) => {
    let [_, key, count="1", timeout="0", start="0" ] = args;
    return ['xread', 'count', count, 'block', timeout, 'streams', key, start];
  },
  'xack': (args) => {
    let [_, key, group, msg ] = args;
    return ['xack', key, group, msg]
  },
  'xgroup': (args) => {
    let [_, key, group, target='$' ] = args;
    return ['xgroup', 'create', key, group, target, 'MKSTREAM']
  },
  'xreadgroup': (args) => {
    let [_, key, group, consumer, count="1", timeout="0", start=">"  ] = args;
    return [
      'xreadgroup', 'group', group, consumer,
       'count', count, 'block', timeout, 'streams', key, start
    ];    
  }
};

var transformCommand = (commands) => {
  let resolve = commandType[lowerCase(first(commands))];
  if(resolve) return resolve(commands);
  return commands;
}

var parseResult = (type) => (result) => {
  if(!result) return result;
  if(type === 'json.get'){
    let res = JSON.parse(result);    
    return isObject(res) ? res : first(res);
  }
  if(type === 'json.mget'){
    return map((r) => (r ? first(JSON.parse(r)) : r), result);
  }
  // TODO: parse search, parse xread  
  return result;
};

// todo: add invalid commands validator
var command = (...args) =>{
  let [commands, client] = args;
  if (args.length === 1) return (client) => command(commands, client);
  let type = lowerCase(first(commands));  
  let adaptCommand = transformCommand(commands);
  if(isFn(client)) (client = client());
  return client.sendCommand(adaptCommand).then(parseResult(type));
}

// todo: add invalid commands validator
var reader = (...args) => {
  let [commands, callback, currentClient] = args;
  if (args.length === 1) return (callback, currentClient) => block(commands, callback, currentClient);
  if (args.length === 2) return (currentClient) => block(commands, callback, currentClient);
  let type = lowerCase(first(commands));
  let closed = false;
  
  let $xreadgroup = (client, commands) =>{    
    return command(commands, client).then((streamData)=>{
      if(!streamData) return (!closed ? $xreadgroup(client, concat(pop(commands), '>')) : null);
      let [[_, data]] = streamData;
      if(!data || data.length === 0) return (!closed ? $xreadgroup(client, concat(pop(commands), '>')) : null);
      callback(data) // TODO: add ack functions
      return (!closed ? $xreadgroup(client, concat(pop(commands), '>')) : null)
    }).catch((err) => (console.log(err),(!closed ? $xreadgroup(client, concat(pop(commands), '>')) : null)))
  }

  var $xread = (client, commands) => {
    return command(commands, client).then((streamData)=>{
      if(!streamData) return (!closed ? $xread(client, commands) : null)
      let [[_, data]] = streamData;
      if(!data || data.length === 0) return (!closed ? $xread(client, commands) : null);
      let lastId = data[data.length -1][0];
      callback(data);
      return (!closed ? $xread(client, concat(pop(commands), lastId)) : null);
    }).catch(err => (console.log(err), (!closed ? $xread(client, commands) : null)));             
  };
  
  var blockType = {
    'xreadgroup': $xreadgroup,
    'xread': $xread,  
    // TODO: more blocking commands
  };

  let processor = blockType[type];
  if(!processor) return console.log('unsupported block type');  

  if(isFn(currentClient)) (currentClient = currentClient());  
  let client = currentClient.duplicate();
  
  // initiate
  client.connect()
    .then((c)=> (commands[0] === 'xreadgroup' ? command(['xgroup', commands[1], commands[2], '$'], client).catch(identity) : c ))  
    .then(() => (!closed ? processor(client, commands) : null));
  
  return {
    close : () => {
      if(closed === false) return (closed=true, client.disconnect());
      return (closed=true, console.log('closed streams'));
    }
  }
};

var createRedis = (ctx, name="redis") => merge(
  ctx,
  { [name]: require('redis').createClient({ url: ctx.url }) }  
);

var connectRedis = (ctx, name="redis") => {
  let client = getIn(ctx, [name]);
  let onError = ctx.onError || ((err) => console.log('Redis error', err));  
  if(!client) return (console.log("cannot connect to redis"), ctx);
  client.on('error', onError);
  return client.connect();   
}

var disconnectRedis = (ctx, name="redis") => {
  let client = getIn(ctx, [name, "disconnect"]);
  if (!client) return ctx;
  return (client.disconnect(), ctx[name]=null, ctx);
}

var getClient = (ctx, name="redis") => () => getIn(ctx, [name]);


/*
  transformCommand(['json.set','foo', 'bar'])
  transformCommand(['json.set','foo', 1])
  transformCommand(['json.set','foo', {foo: 1}])
  transformCommand(['json.set','foo', {foo: 1}, '$'])
  transformCommand(['json.get','foo'])
  transformCommand(['json.mget','foo', 'bar', '$']);
  transformCommand(['ft.create','index', 'json', 'user', ['id', 'as', 'id', 'TAG', ]])
  transformCommand(['ft.search','index', "*"]);
  transformCommand(['xadd','foo', {id: 1}])
  transformCommand(['xadd','foo', {id: 1, calcl: true}, 100])
  transformCommand(['xadd','foo', ['my', 'data']])
  transformCommand(['xadd','foo', ['my', 'data'], 100])
  transformCommand(['xread','foo']);
  transformCommand(['xack','key', 'group', 'data']);
  transformCommand(['xgroup','key', 'group'])
  transformCommand(['xreadgroup','key', 'group', 'consumer'])
*/

/*
 
  reader(['xreadgroup', 'stream', 'group1', 'consumer1', '100', '0', '0'], (data)=> console.log(data), client);
  reader(['xread', 'stream', '100', '0', '0'], (data)=> console.log(data), client);
  
  command(['xadd', 'stream', {data: '1'}], client)  
*/
