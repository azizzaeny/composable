var condtl = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      let fns = partialRight(fn, ...args);
      return fns(acc);  // Thread the value as the last argument
    }
    return acc;  // Skip if condition is false
  }, val);
}; 

export default condtl;