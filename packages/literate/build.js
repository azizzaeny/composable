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
  // todo: create module format output
  // - module import
  // - core body
  // - node.js 
  // - export 
  // todo: create commonjs format output
  // - require module
  // - core body
  // - node.js
  // - module.exports
  return blocks;
}

console.log(build());
