import { readFileSync, existsSync } from 'node:fs';

var  env = (file=".env", state=process.env) => {
  if(!existsSync(file)) return console.log('no file', file);
  let contents = readFileSync(file, 'utf8');  
  let params= contents.split('\n').map((line)=>line.split(/=(.+)/)).reduce((k, [key, value])=>{
    if(value && (value.startsWith('"') || value.startsWith("'"))) (value = value.slice(1, -1));
    return (value) ? ((state[key]=value), Object.assign(k,{[key] : value.trim()})) : k ;
  },{});
  return params
}

export { env };