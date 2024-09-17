var fs = await import('node:fs');
var vm = await import('node:vm');
import { extractCode, groupBlockBy, concatBlockBy } from "./core.mjs";
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

export { evaluate, evaluateBlock, tangle }