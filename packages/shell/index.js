
var {exec} = require('child_process');

function printOut(err, stdout, stderr){
  if(err) return console.log(err);
  console.log(`${stdout}`);
  console.log(`${stderr}`);
}

function sh(cmd){
  return (exec(cmd, printOut), true)
}

function addDeps(modules=[], options){
  if(!Array.isArray(modules)) return console.log('invalid modules collection should be collection modules');
  let mod = modules.join(' ');
  return sh(`npm install ${mod} --save`);
}

module.exports = {sh, addDeps};

/*
addDeps(['ulid', 'redis'])
sh('ls ./node_modules')
sh('ls utility')
sh('git submodule add git@github.com:azizzaeny/composable.git utility')
sh('git pull')
*/
