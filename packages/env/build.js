var fs = require('node:fs');
var { extractCode, groupBlockBy, concatBlockBy, captureCodeAt } = require('@zaeny/literate');
var build = () => {
  let blocks = captureCodeAt('./');
  let importing = blocks.find(v => v.context === 'deps').content;
  let exporting = blocks.find(v => v.context === 'export').content;
  let code = blocks.find(v => v.context === 'core').content;
  let cjsImport = `var ${importing} = require('node:fs');`;
  let cjsExport = `module.exports = ${exporting};`;
  let mjsImport = `import ${importing} from 'node:fs';`;
  let mjsExport = `export ${exporting};`
  let files = [['src/index.js', `${cjsImport}\n\n${code}\n\n${cjsExport}`], ['src/index.mjs', `${mjsImport}\n\n${code}\n\n${mjsExport}`]];
  return files.map(([f, c]) => (fs.writeFileSync(f, c, 'utf8'), f ));
}

console.log(build());
