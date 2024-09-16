var nthrest = (...[coll, n]) =>{
  if(!n) return (n) => nthrest(coll, n);
   return coll.filter((_, i) => i >= n)
} 

export default nthrest;