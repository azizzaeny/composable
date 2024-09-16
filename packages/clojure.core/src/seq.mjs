var seq = (coll) =>{
  if(Array.isArray(coll)) return coll;
  if(typeof coll === 'object') return Object.entries(coll);
  if(typeof coll === 'string') return Array.from(coll);
  return coll;
} 

export default seq;