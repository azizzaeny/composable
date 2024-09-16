
```js context=deps type=module
var fs = await import('node:fs');
var vm = await import('node:vm');
```

```js context=deps type=commonjs
var fs = require('node:fs');
var vm = require('node:vm');
```

```js context=core
var extractCode = (markdown) =>  Array.from(markdown.matchAll(/\`\`\`(\w+)((?:\s+\w+=[\w./-]+)*)\s*([\s\S]*?)\`\`\`/g), match => {
  return Object.assign({ lang: match[1], content: match[3].trim()}, match[2].trim().split(/\s+/).reduce((acc, attr)=>{
    let [key, value] = attr.split('=');
    return (key && value) ? (acc[key] = value, acc) : acc;
  }, {}));
});

var groupBlockBy = (blocks, key='path') => blocks.reduce((acc, value) =>{
  return (!acc[value[key]])
    ?  (acc[value[key]] = value.content, acc)
    : (acc[value[key]] = acc[value[key]].concat('\n', value.content), acc);  
}, {});
```

```js context=node
var readDir = (dirPath) => fs.readdirSync(dirPath);
var readFile = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
var onlyMarkdown = (path) => path.endsWith('.md');
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
```

```js context=export
{ extractCode, groupBlockBy, onlyMarkdown, evaluate, evaluateBlock }
```
