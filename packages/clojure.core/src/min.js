var min = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.min(a, b);
  if(args.length === 2) return Math.min(a, b);
  return args.reduce((acc, val) => Math.min(acc, val));
} 

export default min;