var cons = (...[x, ...seq]) =>{
  if(!seq || seq.length ===0) return (...seq) => cons(x, ...seq);
  return [x].concat(...seq);
} 

export default cons;