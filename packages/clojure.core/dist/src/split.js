//TODO: fix split reg
var split = (...[p, ch]) => {
  if(!ch) return (ch) => split(p, ch);
  return p.split(ch);
} 

export default split;