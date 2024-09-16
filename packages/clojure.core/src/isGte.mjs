var isGte = (a, b) => {
  if(!b) return  (b) => isGte(a,b);
  return a >= b;
} 

export default isGte;