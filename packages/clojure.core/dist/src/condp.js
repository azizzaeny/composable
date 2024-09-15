var condp = (pred, expr, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    let value = clauses[i];
    let result = clauses[i + 1];
    if (pred(expr, value)) { return result; }
  }
  let fallback = clauses[clauses.length - 1];
  return typeof fallback === 'function' ? fallback(expr) : fallback;
}; 

export default condp;