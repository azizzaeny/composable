var cond = (...clauses) => {
  return clauses.reduce((acc, [condition, result]) => {
    return acc === undefined && (condition === true || Boolean(condition)) ? result : acc;
  }, undefined);
}; 

export default cond;