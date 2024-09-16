// TODO: fix multi collection
var interleave = (...args) => {
  let [c1, c2, ...colls] = args;
  if(args.length === 2) return c1.map((v, i) => [v, c2[i]]).flat();
} 

export default interleave;