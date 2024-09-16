// todo: fix keyFn comp
var sortBy=(...args) =>{
  let [fn, coll] = args;
  if (args.length === 1) {
    return coll => [...coll].sort((a, b) => fn(a) - fn(b));
  } else {
    return [...coll].sort((a, b) => fn(a) - fn(b));
  }
} 

export default sortBy;