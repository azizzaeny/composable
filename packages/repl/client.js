// my idea is this should be fetch from github directly so we dont write again

export function reload(){
  window.location.reload();
}

export var r = reload;

export function connectRepl(){
  console.log('connect');
  return fetch(window.location.origin, {
    headers: {'repl': true }
  }).then(res => res.text())
    .then(res => (console.log(res), res))
    .then(res => eval(res))
    .then(_ => setTimeout(()=> connectRepl(), 500))
}      
