
function fnName(func=null){
  if(func && func.name) return func.name;
  let results =  /^function\s+([\w\$]+)\s*\(/.exec(func.toString());
  return result ? result[1] : undefined;
}

function evalInFn(resolveModule, varname, value){
  let exported = require.cache[require.resolve(resolveModule)]['exports'];
  if(typeof varname === "function"){
    return (exported[fnName(varname)]= varname, varname);
  }
  return (exported[varname] = value, value);
}

function evalAtExport(resoveModule, exportObject){
  return (require.cache[require.resolve(resolveModule)]['exports'] = exportObject, true);
}

function reload(){
}

function recache(resolveModule){
  delete require.cache[require.resolve(resolveModule)];
  return require(resolveModule);
}

module.exports = { fnName, evalInFn, evalAtExport, recache  }
