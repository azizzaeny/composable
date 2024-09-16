var fs = await import('node:fs');
var vm = await import('node:vm');
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

export { evaluate, evaluateBlock, tangle }