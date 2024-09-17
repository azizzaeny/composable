### core 
extracting code

```js context=core
var extractCode = (markdown) =>  Array.from(markdown.matchAll(/\`\`\`(\w+)((?:\s+\w+=[\w./-]+)*)\s*([\s\S]*?)\`\`\`/g), match => {
  return Object.assign({ lang: match[1], content: match[3].trim()}, match[2].trim().split(/\s+/).reduce((acc, attr)=>{
    let [key, value] = attr.split('=');
    return (key && value) ? (acc[key] = value, acc) : acc;
  }, {}));
});

var groupBlockBy = (key='path') => (blocks) => blocks.reduce((acc, value) =>{
  if(!value[key]) return acc;
  return (!acc[value[key]])
    ?  (acc[value[key]] = value.content, acc)
    : (acc[value[key]] = acc[value[key]].concat('\n', value.content), acc);  
}, {});

var concatBlockBy = (key) => blocks => blocks.reduce((acc, value) =>{
  if(!value[key]) return acc;
  return (!acc[value[key]])
    ? Object.assign(acc, {[value[key]]: [value]})
    : (acc[value[key]] = acc[value[key]].concat(value), acc)  
}, {});
```

### node 
evaluate and tangle
```js context=node

var evaluate = (code, defaultContext=global, requiredCtx={ require, module, console, setTimeout, setInterval }) => {
  let ctx =  vm.createContext(defaultContext);
  return (
    vm.runInContext(
      code,
      Object.assign(ctx, requiredCtx)
    )
  );
}

var evaluateBlock = (markdown, validation, defaultCtx, requiredCtx) => {
  if(!validation) (validation = (b) => b.eval);
  let blocks = extractCode(markdown);
  let validBlocks = blocks.filter(validation);
  let bundleCodes = validBlocks.reduce((res, val) => res.concat(`${val.content}\n`), '');
  return evaluate(bundleCodes, defaultCtx, requiredCtx);
};

var tangle = (markdown, validation, key='path') => {
  if(!validation) (validation = (b) => b.path);
  let blocks = extractCode(markdown);
  let validBlocks = blocks.filter(validation);
  let groupPath = groupBlockBy(key)(validBlocks);
  return Object.entries(groupPath).map(([file, contents]) => ((file) ? fs.writeFileSync(file, contents, { flag: 'w+'}) : file, file));
}

var readDir = (dirPath) => fs.readdirSync(dirPath);
var readFile = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
var isMarkdown = (file) => file.endsWith('.md');
var captureCode = (path) => extractCode(readFile(path));
var captureCodeAt = (path) => readDir(path).filter(isMarkdown).map(captureCode).flat();
var tangleAt;
var evaluateBlockAt;
```

## importing & exporting   
importing module   
```js context=deps type=module
var fs = await import('node:fs');
var vm = await import('node:vm');
```
require commonjs   
```js context=deps type=commonjs
var fs = require('node:fs');
var vm = require('node:vm');
```
export core   
```js context=export type=core
{ extractCode, groupBlockBy, concatBlockBy }
```
export node  
```js context=export type=node
{ evaluate, evaluateBlock, tangle }
```
export index
```js context=export type=index
{ extractCode, groupBlockBy, evaluate, evaluateBlock, tangle }
```
