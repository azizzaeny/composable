var isLte = (a, b) => {
  if(!b) return (b) => isLt(a, b);
  return a <= b;
} 

export default isLte;