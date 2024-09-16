var isEvery = (...[pred, coll]) =>{
  if(!coll) return (coll) => isEvery(pred, coll);
  return coll.every(pred, coll);
} 

export default isEvery;