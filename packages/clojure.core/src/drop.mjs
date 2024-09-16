var drop = (...[n, coll]) => {
  if(!coll) return (coll) => drop(n, coll);
  return coll.slice(n);
} 

export default drop;