var fs = require('node:fs');
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

var build = (path='./') =>{
  let blocks = readDir(path).filter(onlyMarkdown).map(captureCode).flat().filter(f => f.context);
  let context = (ctx) => (b) => b.lang === 'js' && b.context === ctx;
  let moduleImport = blocks.find(b => context('deps')(b) && b.type === 'module').content;
  let commonJsImport = blocks.find(b => context('deps')(b) && b.type === 'commonjs').content;
  let core = blocks.find(context('core')).content;
  let node = blocks.find(context('node')).content;
  let nodeExport = blocks.find(b => context('export')(b) && b.type==='node').content;
  let coreExport = blocks.find(b => context('export')(b) && b.type==='core').content;
  let indexExport = blocks.find(b => context('export')(b) && b.type==='index').content;  
  let files = {
    './src/cjs/core.js': `${core}\n\nmodule.exports=${coreExport}`,
    './src/mjs/core.mjs': `${core}\n\nexport ${coreExport}`,
    './src/cjs/node.js': `${commonJsImport}\n${node}\n\nmodule.exports=${nodeExport}`,
    './src/mjs/node.mjs': `${moduleImport}\n${node}\n\nexport ${nodeExport}`,
    './src/cjs/index.js': `var ${coreExport} = require('./core');\nvar ${nodeExport} = require('./node');\n\nmodule.exports = ${indexExport}`,
    './src/mjs/index.mjs': `import ${coreExport} from "./core.mjs";\nimport ${nodeExport} from "./node.mjs";\n\nexport ${indexExport}`,
  }; 
  let out = Object.entries(files).map(([loc, contents]) => (fs.writeFileSync(loc, contents, 'utf8'), loc));
  return out;
}

console.log(build());
