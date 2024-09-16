var takeLast= (...[n, coll])=>{  
  if(!coll) return (coll) => takeLast(n, arr1=coll);
  return coll.slice(-n);  
} 

export default takeLast;