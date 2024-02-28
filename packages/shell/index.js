
var {exec, spawn} = require('child_process');

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

function detach(cmd){
  let [proc, ...rest] = cmd.split(' ');
  return (spawn(proc, rest, {stdio: 'inherit', detached: true }).on('data', data => process.stdout.pipe(data)) ,true)
}

module.exports = {sh, detach, addDeps};

/*
addDeps(['ulid', 'redis'])
sh('ls ./node_modules')
sh('ls utility')
sh('git submodule add git@github.com:azizzaeny/composable.git utility')
sh('git pull')
*/
