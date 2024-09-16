var isGt = (a, b) => {
  if(!b) return (b) => isGt(a, b);
  return a > b;
} 

export default isGt;