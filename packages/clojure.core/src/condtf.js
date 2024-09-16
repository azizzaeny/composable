var condtf = (val, ...clauses) => {
  return clauses.reduce((acc, [condition, fn, ...args]) => {
    if (condition) {
      return fn(acc, ...args);  // Thread the value as the first argument
    }
    return acc;  // Skip if the condition is false
  }, val);
}; 

export default condtf;