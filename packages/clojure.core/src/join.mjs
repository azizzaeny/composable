var join =(...args) => {
  let [arr, separator] = args;
  if(args.length === 1) return (separator) => arr.join(separator);
  return arr.join(separator);
} 

export default join;