// long subscribe polling connect to repl
export function start_repl(origin, opts){
  origin = origin  || window.location.origin;
  opts = opts || {'repl': true };
  return fetch(origin, opts).then(res => res.text())
    .then(res => (console.log('evaluate:'), res))
    .then(res => eval(res))
    .then(_ => setTimeout(() => start_repl(origin, opts), 100))
}      
