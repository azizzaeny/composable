// switch to type module
var {minify} = await import('@putout/minify');
var fs = await import('node:fs');
var {execSync} = await import('node:child_process');

var captureCodeBlocks = (markdown) =>  Array.from(markdown.matchAll(/\`\`\`(\w+)((?:\s+\w+=[\w./-]+)*)\s*([\s\S]*?)\`\`\`/g), match => {
  return Object.assign({ lang: match[1], content: match[3].trim()}, match[2].trim().split(/\s+/).reduce((acc, attr)=>{
    let [key, value] = attr.split('=');
    return (key && value) ? (acc[key] = value, acc) : acc;
  }, {}));
});
var readDir = (dirPath) => fs.readdirSync(dirPath);
var readFile = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
var onlyMarkdown = (path) => path.endsWith('.md');
var captureCode = path => captureCodeBlocks(readFile('./'+path));
var writeSync = (file, content, utf8 = 'utf8') => fs.writeFileSync(file, content, utf8);
var groupByFn = (acc, value) => {
  if(!value.fn) return acc;
  return (!acc[value.fn])
    ? Object.assign(acc, { [value.fn]: [value] })
    : (acc[value.fn] = acc[value.fn].concat(value) ,acc);
  return acc;
};
var build = (path='./') =>{
  let exportDefault = (name) => `export default ${name};`;
  let refcard = readDir(path).filter(onlyMarkdown).map(captureCode).flat().reduce(groupByFn, {});
  let core = Object.entries(refcard).reduce((acc, [kfn, vfn])=>{
    let content = vfn.reduce((acc, value) => (value.context === 'core') ? acc.concat(`\n\n${value.content}`) : acc, '');
    let contentExport =`${content} \n\n${exportDefault(kfn)}`;
    let foundDeps = vfn.find(value => value.deps);
    if(foundDeps){
      let deps = foundDeps.deps;
      contentExport = `import ${deps} from "./${deps}.js";\n${content}\n\n${exportDefault(kfn)}`;
    }
    return acc.concat(content);
  }, '').replace(/^\s+/, '');  
  writeSync('./dist/core.min.js', minify(`${core}`,{removeUnusedVariables: false, mangle:false}));
  return true;
}

console.log(build());

