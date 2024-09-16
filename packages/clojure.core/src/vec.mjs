var vec = (coll) =>{
  if (!coll) return [];
  if (Array.isArray(coll)) return coll;
  if (typeof coll === 'string') return coll.split('');
  if (typeof coll[Symbol.iterator] === 'function') return Array.from(coll);
  return Object.values(coll);
} 

export default vec;