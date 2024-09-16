// TODO: more arguments sets
var difference =(...args) => {
  let [s1, s2, ...sets] = args;
  if(args.length === 1) return (s2, ...sets) => difference(s1, s2, ...sets);
  return s1.filter((x) => !s2.includes(x)); // TODO: more args
} 

export default difference;