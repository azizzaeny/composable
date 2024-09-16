var swap = (...args) => {
  let [atom, fn, ...rest] = args;
  if(args.length === 1) return (fn, ...rest) => atom.swap(fn, ...rest);
  return (atom.swap(fn, ...args), atom.deref());
} 

export default swap;