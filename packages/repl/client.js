// my idea is this should be fetch from github directly so we dont write again

function reload(){
  window.location.reload();
}

var r = reload;

function connectRepl(){
  console.log('subscribing');
  return fetch(window.location.origin, {
    headers: {'repl': true }
  }).then(res => res.text())
    .then(res => (console.log(res), res))
    .then(res => eval(res))
    .then(_ => setTimeout(()=> connectRepl(), 500))
}      
