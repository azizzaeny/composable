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

module.exports={ extractCode, groupBlockBy, concatBlockBy }