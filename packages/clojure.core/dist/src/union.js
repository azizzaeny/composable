// TODO: more args
var union = (...args) => {
  let [s1, s2, ...sets] = args;
  return (args.length == 1) ? (s2, ...sets) => union(s1, s2, ...sets) : Array.from(new Set([...s1, ...s2, ...sets]));
} 

export default union;