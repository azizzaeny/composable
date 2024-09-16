var quot = (...args) => {
  let [a, b] = args;
  if(args.length === 1) return (b) => Math.floor(a / b);
  return Math.floor(a / b);
} 

export default quot;