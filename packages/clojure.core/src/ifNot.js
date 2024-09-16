var ifNot = (test, thenFn, elseFn = () => {}) => {
  if (!test) {
    return thenFn();
  } else {
    return elseFn();
  }
}; 

export default ifNot;