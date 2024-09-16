// TODO: more arguments sets
var intersection = (...args) =>{
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => intersection(s1, s2, ...sets);
  return s1.filter((x) => s2.includes(x));
} 

export default intersection;