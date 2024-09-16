// todo: add ore args, timout-ms timout-val
var deref =(atom) => {
  if(!atom.deref) return null;
  return atom.deref();
} 

export default deref;