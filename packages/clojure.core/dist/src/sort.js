var sort = (...args) => {
  let [arr, comp = (a, b) => a - b] = args;
  return args.length === 1 ? [...arr].sort() : [...arr].sort(comp);
} 

export default sort;