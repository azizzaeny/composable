const https = require('https');
const vm    = require('vm');
var defaultContext = vm.createContext(global);

function fetch(url, context) {
  if(!context) (context = defaultContext);
  return new Promise((resolve, reject) =>{
    https.get(url, res =>{
      let data ='';
      res.on('data', chunk => (data += chunk));
      res.on('end', _ => (vm.runInContext(data, context), resolve(data)));
      res.on('error', err => reject(err));             
    })
  });
}
