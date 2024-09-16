var max = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.max(a, b);  
  if(args.length === 2) return Math.max(a, b);
  return args.reduce((acc, val) => Math.max(acc, val))
} 

export default max;