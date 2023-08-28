// simple repl for backend 
import handler from 'serve-handler';
import http from 'node:http';
import repl from 'node:repl';

var requests = [];

var server = http.createServer((req, res) =>{
  if(req.url === '/repl'){
    requests.push({res});
    return;
  }
  
  return handler(req, res, {
    public: './public'
  });
});

server.listen(8080, ()=> console.log('starting at port'));

var mode = 'backend'; // 'frontend';

var serverRepl = repl.start({
  promt: '>',
  ignoreUndefined: true,
  preview: false
});

var _eval = serverRepl.eval;

var commands =  [
  {
    cmd: 'front',
    help: 'changes to frontend repl',
    action: function() { mode= 'frontend'; }
  },
  {
    cmd: 'back',
    help: 'changes to backend repl',
    action: function(){ mode= 'backend';}
  }
];

function frontBack(input, context, filename, callback){
  // console.log('evaling', mode);
  if(mode === 'frontend'){
    if(requests.length > 0){
      requests.forEach(client => client.res.end(input));
      requests = [];
    }
    return _eval("", context, filename, callback);
  }
  return _eval(input, context, filename, callback);
}

commands.forEach((cm) => serverRepl.defineCommand(cm.cmd, {
  help: cm.help,
  action: cm.action
}));

serverRepl.eval = frontBack;
serverRepl.context.mode = mode;
serverRepl.context.requests = requests;
