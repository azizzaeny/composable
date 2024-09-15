var add = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => a + b;
  if(args.length === 2) return a + b;
  return args.reduce((sum, num) => sum + num, 0);
} 

export default add;