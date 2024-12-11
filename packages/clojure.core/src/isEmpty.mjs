var isEmpty = (coll) => {
  if(!coll || coll === null || coll === undefined) return true
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
}; 

export default isEmpty;