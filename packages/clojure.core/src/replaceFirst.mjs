var replaceFirst = (...args) => {
  let [str, pattern, replacement] = args;
  if(args.length === 1) return (pattern, replacement) => str.replace(pattern, replacement);
  return str.replace(pattern, replacement);
} 

export default replaceFirst;