var partialRight = (fn, ...leftArgs) => {
  return (...rightArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
}; 

export default partialRight;