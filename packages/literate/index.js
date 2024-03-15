var fs = require('fs');

var extractCode = (markdown) =>{
  let regex = /```(\w+)((?:\s+\w+=[\w./]+)*)\s*([\s\S]*?)```/g;
  let extractParams = (paramsString) => {
    if(paramsString){
      return paramsString.split(/\s+/).reduce((acc, params)=>{
        let [key, value] = params.split('=');
        if(key && value){
          acc[key] = isNaN(value) ? value : parseInt(value);
        }     
        return acc;
      }, {});
    }
    return {};
  }
  return [...markdown.matchAll(regex)].reduce((acc, match) => {
    let lang         = match[1];
    let paramsString = match[2];
    let code         = match[3].trim();
    let params       = extractParams(paramsString);
    return acc.concat({
      ...params,
      lang,
      code
    });
  }, []);
}

var groupCodeByPath = (extracted) =>{
  return extracted.reduce((acc, value)=>{
    if(!acc[value['path']]){
      acc[value['path']] = value['code'];
    }else{
      acc[value['path']] = acc[value['path']].concat('\n\n', value['code'])
    }
    return acc;
  }, {})
}

var readFiles = (files) => files.map((file) => fs.readFileSync(file, 'utf8')).join('\n');

var tangle = (files) =>{
  let bundle = readFiles(files);
  let code   = extractCode(bundle);
  let takeHasPath = code.filter(b => b.path);
  let groupFile = groupCodeByPath(takeHasPath);
  var writeOut = Object.entries(groupFile).map(([file, contents]) => ((file) ? fs.writeFileSync(file, contents, { flag: 'w+'}) : file, file));  
  return 'tangle files:' + writeOut.length + writeOut.join(' ');
}

var tangleCode = bundle => {
  let code   = extractCode(bundle);
  let takeHasPath = code.filter(b => b.path);
  let groupFile = groupCodeByPath(takeHasPath);
  var writeOut = Object.entries(groupFile).map(([file, contents]) => ((file) ? fs.writeFileSync(file, contents, { flag: 'w+'}) : file, file));  
  return `tangle files: #${writeOut.length} ${writeOut.join(' ')}`;
}

// example eval code and from files, 
var evalCode = (code) => {
  let vm = require('vm');
  let ctx =  vm.createContext(global);
  return (
    vm.runInContext(
      code,
      Object.assign(ctx, {require, module, console })
    )
  );
}

var evalFromFiles = (files)=> {
  let blocks = extractCode(readFiles(files));
  let takeHasEvaluate = blocks.filter(b => b.evaluate);
  let codes = takeHasEvaluate.reduce((res, val) => res.concat(val.code), '');
  return evalCode(codes);
}

module.exports = {
  extractCode,
  readFiles,
  tangle,
  tangleCode,
}

/*
var e = extractCode("##markdown `\`\`\js path=foo \n foo `\`\`\ ")
*/
