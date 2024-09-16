var removeWatch = (...args) => {
  let [atom, watcherFn] = args;
  if(args.length === 1) return (watcherFn) => atom.removeWatch(watcherFn);
  return atom.removeWatch(watcherFn);
} 

export default removeWatch;