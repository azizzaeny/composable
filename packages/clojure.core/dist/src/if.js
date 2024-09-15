$
var if$ = (test, thenFn, elseFn = () => {}) => {
  return test ? thenFn() : elseFn();
}; 

export default if;