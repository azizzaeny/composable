var zipmap = (...[ks, vals]) =>{
  if(!vals) return (ks) => zipmap(ks, vals);
  return ks.reduce((acc, key, i)=> (acc[key]=vals[i], acc), {});
} 

export default zipmap;