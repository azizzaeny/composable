var addWatch = (...args)=> {
  let [atom, name, watcherFn] = args;
  if(args.length === 1) return (name, watcherFn) => atom.addWatch(name, watcherFn);
  return (atom.addWatch(name, watcherFn));
} 

export default addWatch;