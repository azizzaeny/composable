var splitAt = (...[n, coll])=>{
  if(!coll) return (coll) => splitAt(n, coll);
  return [coll.slice(0, n), coll.slice(n)];
} 

export default splitAt;