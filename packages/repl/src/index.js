
/* default top level context */
var defaultContext = defaultContext || Object.assign({}, global);
var defaultKeys    = defaultKeys || Object.keys(defaultContext).concat(['_', '_error', 'require', 'module', 'process'])
var defaultExpose  = defaultExpose || {};

/* deps*/
var path   = require('path');
var vm     = require('vm');
var Module = require('module');
var fs     = require('fs');
var repl   = require('repl');

/* state */
var __value = __value || null;
var __error = __error || null;
var patchedRequire = patchedRequire || false;


/* patch require*/
var originalRequire = Module.prototype.require;
Module.prototype.require = function(id){
  let moduleId = getModule(id);
  if(moduleId) return moduleId.exports;  
  try {
    return originalRequire.apply(this, arguments);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') console.error(`Cannot find module: ${id}`);
    throw err;
  }
}

/* @zaeny/clojure.core deps */
var dissoc = (m, ...keys) => {
  let coll = {...m};
  return (keys.forEach(key => delete coll[key]), coll);
}

var isString = (val) => (typeof val === 'string' || val instanceof String);

/* fs utility  */
var readFile = file => fs.readFileSync(file, 'utf8') || '';
var isNotDir = (file) => !fs.statSync(file).isDirectory();
var isFileWithExt = (file) => path.extname(file) === '.js' || path.extname(file) === '.mjs';

/* implementation  module */
var resolvePathWithExt = (id, ext) =>  path.resolve(process.cwd(), id+ext);

var getModule = (id) => {
  return Module._cache[id] ||
    Module._cache[resolvePathWithExt(id, '.js')] ||
    Module._cache[resolvePathWithExt(id, '.mjs')] ||
    Module._cache[resolvePathWithExt(id, '.json')];
};

var createModule = (id) => {
  if(getModule(id)) return false;
  let module = new Module(id);
  ( module.path = process.cwd(),
    module.filename = id,
    module.paths = Module._nodeModulePaths(process.cwd()),
    Module._cache[id] = module,
    module.ns = id,
    module.loaded = true );
  return true;
}

/* evaluation */
var defaultAfterEvalHook = (value, module) =>{
  if(module){
    let currentExports = module.exports;
    let defaultAllkeys =  defaultKeys.concat(Object.keys(defaultExpose));
    module.exports = Object.assign(currentExports, dissoc(module.context, ...defaultAllkeys)); 
  };
  return value;
};

var evaluateGlobal = (code) => {
  let context = vm.createContext(Object.assign(global, defaultExpose));
  let value =  vm.runInContext(code, Object.assign(context, defaultExpose, { require, module, process }));
  return value;  
}

var evaluateIn = (code, id) => {
  let module = (createModule(id), getModule(id));
  if(!module.context) (module.context = vm.createContext(Object.assign({}, defaultContext, {require, module, process}, defaultExpose)));
  let script = new vm.Script(code);
  let value = script.runInContext(module.context);
  return {value, module};
}

var isDefaultContext = (id) => (id === 'main' || id === 'global' || id === null);
// todo: make evaluate to be customize
var createEvaluate = (afterEvalHook=defaultAfterEvalHook) => (code, id='main') => {
  try{
    if(isDefaultContext(id)){
      let value =  evaluateGlobal(code);
      return afterEvalHook(value, null)
    }
    let { value, module } =  evaluateIn(code, id);
    return afterEvalHook(value, module);
  }catch(err){
    console.log('error: '+err);
  }
}

var evaluate = createEvaluate(defaultAfterEvalHook);

/* Repl evaluation implementation */
var currentContext = 'main';
var getPrompt  = () => `${currentContext}> `;

var inContext= (newContext) => {
  currentContext = newContext;
};

var lastContext = () => currentContext;

var isRecoverable = (error) => {
  if (error.name === 'SyntaxError' || error instanceof SyntaxError) {
    return /^(Unexpected end of input|Unexpected token)/.test(error.message);
  }
  return false; 
}

var evaluateReplExpression = async (sourceCode, context, filename, callback) => {
  let code = sourceCode.trim().startsWith('await') ? `(async () => { return ${sourceCode.trim()} })()` : sourceCode.trim();  
  try{
    let script = new vm.Script(code, {filename});
    let result = await evaluate(code, currentContext);
    if (result instanceof Promise) (result = await result);
    callback(null, result);    
  }catch(error){
    if(isRecoverable(error)) return callback(new repl.Recoverable(error));
    callback(error);
  }
}

var createRepl = () => {
  return {
    prompt: getPrompt(),
    eval: evaluateReplExpression,
    useColors: true,
    terminal: true,
    ignoreUndefined: true,    
  }
};

/* repl supported functions */
var getFileWithExtension = (file) =>{
  if(fs.existsSync(file)) return file;
  if(fs.existsSync(file+'.js')) return file+'.js';
  if(fs.existsSync(file+'.mjs')) return file+'.mjs';
  return false;
}

var isValidLoadFile = (file) => isNotDir(file) && isFileWithExt(file);

var defaultTransformer= (code) => code;

var loadSource = (file, contextId, transformer=defaultTransformer) => {
  let fileExt = getFileWithExtension(file);
  let code = (fileExt && fs.readFileSync(fileExt, 'utf8')) || "";
  let transformedCode = transformer(code);
  return evaluate(code, contextId);
}

var loadFile = (file, contextId) => loadSource(file, contextId, defaultTransformer);

var loadDir = (dir, contextId, transformer=defaultTransformer) => {
  let pathDir = (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
      .map((file) => `${dir}/${file}`)
      .filter(isValidLoadFile);
  return pathDir.map((file) => (evaluate(transformer(readFile(file)) , contextId),file));  
}

var listExports = (contextId) =>{
  if(isDefaultContext(contextId)) return (console.log('global context no exports'),{});
  if(contextId && !isDefaultContext(contextId)) return evaluate(`module.exports`, contextId);
  return {};
};

var listContext = () => {
  return Object.entries(Module._cache)
    .reduce((acc, [key, value]) => Module._cache[key]['ns'] ? acc.concat([key]) : acc , [])
};

var listAllContext = () =>  Object.keys(Module._cache);

var expose = (object, id) => {
  if(!id) return (defaultExpose = Object.assign(defaultExpose, object), true);
  let module = getModule(id);
  if(!module) return false;
  module.context = Object.assign(module.context, object);
  return true;
};

var exportAt = (code, id) => {
  let internalEvaluate = createEvaluate((value, module) => value);
  let sourceCode = code.startsWith('module.') ? code : `module.exports = ${code};`
  return internalEvaluate(sourceCode, id);
};

/* repl extendability command  */
var loadFileRepl = (_repl) => ({
  'load-file': {
    help: 'load files into context',
    action: (params) => {
      let [file, ctx] = params.split(' ');
      let context = ctx ? ctx : lastContext();
      loadFile(file, context);
      _repl.displayPrompt();
    }
  }
});

var loadDirRepl = (_repl) => ({
  'load-dir': {
    help: 'load dir into context',
    action: (params) => {
      let [dir, ctx] = params.split(' ');
      let context = ctx ? ctx : lastContext();
      loadDir(file, context);
      _repl.displayPrompt();
    }
  }
});

var inContextRepl = (_repl) => ({
  'in-context': {
    help: 'change current context evaluateion',
    action: (params) => {
      let id = params.split(' ')[0];
      inContext(id);
      _repl.setPrompt(getPrompt());
      _repl.displayPrompt();
    },
  }
});

var listContextRepl = (_repl) => ({
  'list-context': {
    help: 'list context ',
    action: (params) => {
      let id = params.split(' ')[0];
      console.log(listContext());
      _repl.displayPrompt();
    },
  }
});

var listExportsRepl = (_repl) => ({
  'list-export': {
    help: 'list exports fo current context ',
    action: (params) => {
      let id = params.split(' ')[0];
      let ctx = id ? id : lastContext()
      console.log(listExports(ctx));
      _repl.displayPrompt();
    },
  }
});

var getDefaultCommands = (_repl) => Object.assign(
  {},
  inContextRepl(_repl),
  loadFileRepl(_repl),
  loadDirRepl(_repl),
  listContextRepl(_repl),
  listExportsRepl(_repl)
);
var extendRepl = (_repl, commands={}) => {
  let defaultCommands = getDefaultCommands(_repl);
  if(!_repl) return;
  Object.entries(Object.assign(defaultCommands, commands)).map(([key, value])=>{
    return _repl.defineCommand(key, value);
  });
};

/* end API starting the repl with default commands */
var startRepl = (opt=createRepl(), extendDefaultCommand={}) => {
  let _repl = repl.start(opt);
  extendRepl(_repl, extendDefaultCommand);
  return _repl;
}

module.exports = {
  createRepl, extendRepl, startRepl, 
  evaluate, evaluateGlobal, evaluateIn, createEvaluate,
  createModule, getModule,
  loadSource, loadFile, loadDir,
  listExports, exportAt, expose, 
  listContext, lastContext, inContext,
};
