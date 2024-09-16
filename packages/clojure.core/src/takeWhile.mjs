var takeWhile = (...[pred, coll]) =>{
  if (!coll) return coll => takeWhile(pred, coll);  
  let index = coll.findIndex(val => !pred(val))
  return index === -1 ? coll : coll.slice(0, index);
} 

export default takeWhile;