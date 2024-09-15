var remove = (...[pred, coll]) => {
  if(!coll) return (coll) => remove(pred, coll);
  return coll.filter(item => !pred(item));
} 

export default remove;