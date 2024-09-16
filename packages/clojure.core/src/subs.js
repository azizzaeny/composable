var subs = (...args) => {
  let [str, start, end] = args;
  if(args.length === 1) return (start, end) => str.substring(start, end);
  return str.substring(start, end);
} 

export default subs;