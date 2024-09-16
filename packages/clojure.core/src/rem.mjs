var rem = (...args) => {
  let [a, b] = args;
  if (args.length === 1) return (b) => ((a % b) + b) % b;
  return ((a % b) + b) % b;
} 

export default rem;