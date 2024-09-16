var iff = (test, thenFn, elseFn = () => {}) => {
  return test ? thenFn() : elseFn();
}; 

export default iff;