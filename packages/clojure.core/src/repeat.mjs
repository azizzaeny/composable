var repeat = (...[n, x]) =>{
  if(!x) return (x) => repeat(n, x);
  return Array(n).fill(x);
} 

export default repeat;