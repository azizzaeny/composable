var partial = (fn, ...rightArgs) => {
  return (...leftArgs) => {
    return fn(...leftArgs, ...rightArgs);
  };
}; 

export default partial;