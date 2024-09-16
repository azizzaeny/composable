var reset = (...args) => {
  let [atom, value] = args
  if(args.length === 1) return (value) => atom.reset(value);
  return (atom.reset(value), atom.deref());
} 

export default reset;