// my idea is this should be fetch from github directly so we dont write again

export function reload(){
  window.location.reload();
}

export var r = reload;

export function connectRepl(origin){
  console.log('connect to', origin);
  origin = origin  || window.location.origin;
  return fetch(origin, {
    headers: {'repl': true }
  }).then(res => res.text())
    .then(res => (console.log(res), res))
    .then(res => eval(res))
    .then(_ => setTimeout(()=> connectRepl(origin), 500))
}      
