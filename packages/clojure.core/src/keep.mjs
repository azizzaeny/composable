var keep = (...[f, coll]) =>{
  if(!coll) return (coll) => keep(f, coll);
  return coll.reduce((acc, curr)=>{
    let res = f(curr);
    if(res !== null && res !== undefined) return acc.concat(res);
    return acc;
  }, []);
} 

export default keep;