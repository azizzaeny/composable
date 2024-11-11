var redis = require('redis');

var isEven =(x) => {
  return x % 2 === 0;
}
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
var reduce = (...args) => {
  let [reducer, initialValue, arr] = args;
  if(args.length === 1){
    return coll => reduce(reducer, null, coll);
  }
  if (args.length === 2) {
    return coll => reduce(reducer, initialValueHolder, coll)
  }
  return arr.reduce(reducer, initialValue)
}
var parseData = (data) => {
  if (isObject(data)) return map(toString, flatten(seq(data)))
  return data;
}
var toString = (k) => k.toString();

var stringify = (data) => {
  return isObject(data) ? JSON.stringify(data) : (!isString(data) ? data.toString() : data);
}

var parseResult = (type, command) => (result) => {
  if(!result) return result;
  if(type === 'json.get'){
    try{
      let res = JSON.parse(result);
      return res;
    }catch(err){
      console.log('Unable to parse result');
      return {};
    }    
  }
  if(type === 'json.mget'){
    return map((r) => {
      if(r){
        if(last(command) === '$') return first(JSON.parse(r));
        return JSON.parse(r);
      }
      return r;
    }, result);
  }
  return result;
};

var commandType = {
  'json.set': (args) => { 
    let [_, key, path, value  ] = args; 
    return ['JSON.SET', key, path, stringify(value)];  
  },
  'json.get': (args) =>{
    let [_, key, ...path] = args;    
    return (path) ? concat(['JSON.GET', key], path) : ['JSON.GET', key];
  },
  'json.mget': (args) => {
    let path = peek(args) || '$';
    let keys = pop(rest(args));    
    return concat(['JSON.MGET'], keys, path);
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
  'xreadgroup': (args) => {
    let [_, key, group, consumer, count="1", timeout="0", start=">"  ] = args;
    return [
      'xreadgroup', 'group', group, consumer,
      'count', count, 'block', timeout, 'streams', key, start
    ];    
  },  
  'xgroup': (args) => {
    let [_, key, group, target='$' ] = args;
    return ['xgroup', 'create', key, group, target, 'MKSTREAM']
  },
}

var transformCommand = (commands) => {
  let resolve = commandType[lowerCase(first(commands))];
  if(resolve) return resolve(commands);
  return commands;
}

var command = (...args) =>{
  let [commands, client] = args;
  if (args.length === 1) return (client) => command(commands, client);
  let type = lowerCase(first(commands));  
  let adaptCommand = transformCommand(commands);  
  if(isFn(client)) (client = client());
  return client.sendCommand(adaptCommand).then(parseResult(type, adaptCommand));
}

var tfload = (pathFile, client) => command(['TFUNCTION', 'LOAD', 'REPLACE', require('fs').readFileSync(`${pathFile}`,'utf8')], client);

var tfcall = (...args) =>{
  let [libMethod, ...restArgs] = args;
  let client = peek(restArgs); 
  let arg = pop(rest(restArgs));
  return command(concat(['TFCALLASYNC', libMethod], arg), client);
}


var retry_strategy = (options) => {
  if (options.error && options.error.code === 'ECONNREFUSED') {
    // End reconnecting on a specific error and flush all commands with a individual error
    console.error('The server refused the connection');
    return new Error('The server refused the connection');
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands with a individual error
    console.error('Retry time exhausted');
    return new Error('Retry time exhausted');
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    console.error('Too many attempts');
    return undefined;
  }
  // Reconnect after
  return Math.min(options.attempt * 100, 3000);
}

var createRedis = (url, options={}) => {
  let opt = merge({ url }, {retry_strategy }, options);
  return redis.createClient(opt);  
}

var createCluster = (urls, options={}) =>{
  let opt = merge({ rootNodes: urls }, {retry_strategy }, options);
  return redis.createCluster(opt);
}

var connectRedis = (client, onError, onReconnect) => {
  if(!onError) onError = ((err) => console.log('redis error', err));
  if(!onReconnect) onReconnect = ((details) =>  console.log('Redis reconnecting ...'));  
  client.on('error', onError);
  client.on('reconnecting', onReconnect);
  return client.connect();  
}

var disconnectRedis = (client) => client.disconnect();

var ack = (key, group, client) => (ids) => command(['XACK', key, group].concat(ids), client).catch((err) => console.log(err));

var reader = (...args) => {
  let [cmd, callback, currentClient] = args;
  let closed = false; // shared state  
  let $xreadgroup = (cmd, client, cb) => {
    let block = () => (!closed ? $xreadgroup(concat(pop(cmd), '>'), client, cb) : null);    
    return command(cmd, client).then((stream)=>{
      if(!stream) return block();
      let [[_, data]] = stream;
      if(!data || data.length === 0) return block();
      let skey = cmd[1];
      let sgroup = cmd[2];
      cb(data, ack(skey, sgroup, client)); // acking
      return block();
    }).catch((err) => (console.log(err),  block()));
  };
  let $xread = (cmd, client, cb) => {
    let block = () => (!closed ? $xread(cmd, client, cb) : null);
    return command(cmd, client).then((stream)=>{
      if(!stream) return block();
      let [[_, data]] = stream;
      if(!data || data.length === 0) return block();
      let lastId = data[data.length -1][0];
      cb(data);
      return (!closed ? $xread(concat(pop(cmd), lastId), client, cb) : null);
    }).catch((err) => (console.log(err),  block()));
  };  
  let type = lowerCase(first(cmd));  
  let blockType = {
    'xreadgroup': $xreadgroup,
    'xread': $xread,  
  };  
  let processor = blockType[type];
  if(!processor) return console.log('unsupported block type');  
  if(isFn(currentClient)) (currentClient = currentClient());  
  let client = currentClient.duplicate();  
  let isTypeGroup = (cmd[0] === 'xreadgroup');
  let createGroup = (c)=> (cmd[0] === 'xreadgroup' ? command(['xgroup', cmd[1], cmd[2],'$'], client).catch(identity) : c );
  let processCommand = () => {
    return (!closed ? processor(cmd, client, callback) : null);
  }
  client.connect().then(createGroup).then(processCommand).catch((err)=> (closed = true, console.log(err)));
  return {
    close : () => {
      if(closed === false) return (closed = true, client.disconnect());
      return (closed = true, null)
    }
  }
}

var parsePair = (data) => reduce((acc, curr, index, arr)=>{
  if(isEven(index)){
    let key   = (curr.startsWith('$.') ? curr.substring(2) : curr);
    let value = arr[index + 1];
    if(value.startsWith('{') || value.startsWith('[')){
      try{ value = JSON.parse(value); }catch(err){ value=null }
    }
    (acc[key] = value);
  }
  return acc;
}, {}, data);

module.exports = { reader, command, createRedis, createCluster, connectRedis, disconnectRedis, parsePair, tfload, tfcall };
