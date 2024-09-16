var conj = (...[coll, ...xs]) =>{
  if(!xs || xs.length === 0) return (...xs) => conj(coll, ...xs);
  return [...coll, ...xs];
} 

export default conj;