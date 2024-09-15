var isEmpty = (coll) => {
  if(typeof coll === 'object'){
    return (Object.keys(coll).length === 0);
  }
  return coll.length === 0;
} 

export default isEmpty;