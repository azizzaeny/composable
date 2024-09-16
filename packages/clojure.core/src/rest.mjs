var nth = (...[coll, index]) =>{
  if(!index) return (index) => nth(coll, index);
  return coll[index];
}

var rest = (coll) => coll.slice(1); 

export default rest;