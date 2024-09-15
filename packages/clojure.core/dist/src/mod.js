var mod = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a % b;
  return a % b;
} 

export default mod;