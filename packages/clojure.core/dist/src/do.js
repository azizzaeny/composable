$
var do$ = (...exprs) => {
  let result;
  exprs.forEach(fn => {
    result = fn();
  });
  return result;
}; 

export default do;