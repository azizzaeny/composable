var fs = await import('node:fs');

var map = (...args) =>{
  let [fn, arr] = args;
  if (args.length === 1) {
    return coll => map(fn, coll);
  }
  return arr.map(fn);
}

var filter = (...args) =>{
  let [predicate, arr] = args;
  if (args.length === 1) {
    return coll => filter(predicate, coll);
  }
  return arr.filter(predicate);
}

var define = module => Object.assign(global, require(module));

var evaluate= (opt) => {
  if(!opt){
    opt = { ctx: global, addCtx: {console, require, module}};
  }    
  return (res) => {
    let vm = require('vm');
    let context = vm.createContext(opt.ctx);
    return vm.runInContext(res, Object.assign(context, opt.addCtx));
  }
}

var readDir = (dirPath) => fs.readdirSync(dirPath)
var readFile = (file) => fs.readFileSync(file, 'utf8');
var isJs =  file => (require('path').extname(file) === '.js');
var isDir = dirPath => fs.statSync(dirPath).isDirectory();

var expose = (path)=>{
  if(!isDir(path)) return evaluate(null)(readFile(path));
  let dir = filter(isJs, readDir(path)) || [];
  let f = map((e)=> {
    let loc =path+'/'+e;
    return readFile(loc);
  }, dir);
  return map(evaluate(null), f);
}

export { define, evaluate, expose }
