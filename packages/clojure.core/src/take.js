var take = (...[n, coll]) => {
  if(!coll) return (coll) => take(n, coll);
  return coll.slice(0, n);
} 

export default take;