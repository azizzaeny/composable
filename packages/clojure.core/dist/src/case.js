$
var case$ = (e, ...clauses) => {
  for (let i = 0; i < clauses.length - 1; i += 2) {
    if (clauses[i] === e) {
      return clauses[i + 1];
    }
  }
  return clauses[clauses.length - 1]; // Default case
}; 

export default case;