var compareAndSet = (...args) => {
  let [atom, expected, newVal] = args;
  if(args.length === 1) return (expected, newVal) => atom.compareAndSet(expected, newVal);  
  return  atom.compareAndSet(expected, newVal);
} 

export default compareAndSet;