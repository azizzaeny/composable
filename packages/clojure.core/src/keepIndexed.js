var keepIndexed = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr, i)=>{
    let res = f(i, curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
} 

export default keepIndexed;