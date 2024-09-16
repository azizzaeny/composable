var groupBy = (...[f, coll]) =>{
  if(!coll) return (coll) => groupBy(f, coll);
  return coll.reduce((acc, curr) => {
    let key = f(curr);
    if(!acc[key]) (acc[key]=[]);
    return (acc[key].push(curr), acc);
  }, {});
} 

export default groupBy;