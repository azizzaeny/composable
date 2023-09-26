// custom readline nodejs sockets
// format {code, path, at, line, file}
// evaluate code

var net      = require('net');
var readline = require('readline');
var vm       = require('vm');
var context;

function evaluate(line, socket){
  try{
    let msg = JSON.parse(line);
    if(msg && typeof msg.code === 'string'){
      // eval(msg.code);
      var res = vm.runInContext(msg.code, context);
      socket.write(`${res}\n`);
    }else{
      socket.write(`Invalid msg format, ${line} \n`);
    }
  }catch(err){
    socket.write(`Error : ${err.message}\n`);
  }
}

function start(port){
  if(!port) (port=1355);
  if(process._SOCKET) return console.log(`socket repl already start at ${port}`);
  context = vm.createContext(global);
  process._SOCKET = net.createServer(socket => {
    process._READLINE = readline.createInterface({
      input : socket,
      output: socket,
      prompt: ''
    });
    process._READLINE.on('line', line => evaluate(line, socket));
    socket.on('end', ()=> process._READLINE.close());
  });
  process._SOCKET.listen(port, ()=> console.log(`socket repl running on port ${port}`));
}

function stop(){
  if( process._SOCKET && process._SOCKET.destroy ) process._SOCKET.destroy();
}

module.exports = {start, stop}
