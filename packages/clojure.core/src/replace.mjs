var replace = (...args) =>{
  let [s, match, replacement] = args;
  if(args.length === 1) return (match, replacement) => s.replace(match, replacement);
  return s.replace(new RegExp(match, "g"), replacement);
} 

export default replace;