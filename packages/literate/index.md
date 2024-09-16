
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
  let groupFile = groupBlockBy(validBlocks, key);
  return Object.entries(groupFile).map(([file, contents]) => ((file) ? fs.writeFileSync(file, contents, { flag: 'w+'}) : file, file));
}

var tangleDir;
var evaluateBlockAtDir;
```

```js context=export
{ extractCode, groupBlockBy, onlyMarkdown, evaluate, evaluateBlock, tangle }
```
