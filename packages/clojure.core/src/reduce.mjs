var reduce = (...args) => {
  let [f, val, coll] = args;
  if(args.length === 1) return (coll) => reduce(f, undefined, coll);
  if(args.length === 2) return (coll) => reduce(f, val, coll);
  return coll.reduce(f, val);
} 

export default reduce;