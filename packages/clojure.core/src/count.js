var count  = (coll) =>{
  if(isMap(coll)) return keys(coll).length;
  return coll.length;
} 

export default count;