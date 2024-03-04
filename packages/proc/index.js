
var  handleExit = (msg) => (err) => console.log(msg, err);

function createHandleException(message='signal'){  
  return [
    ['on', 'unhandledRejection', handleExit(message)],
    ['on', 'uncaughtException', handleExit(message)],
    ['once', 'SIGTERM', handleExit(message)],
    ['once', 'SIGINT', handleExit(message)],
    ['once', 'SIGUSR2', handleExit(message)],  
  ];
}

function handleException(process, handler){
  return handler.reduce((acc, [on, type, call])=>{
    return (process[on](type, call), acc.concat(type));
  }, []);
}

function processException(process, message){
  return handleException(process, createHandleException(message))
}

module.exports = {processException};
