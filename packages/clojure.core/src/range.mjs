// todo: fix args
var range = (...args)  =>{
  let [start, end, step=1] = args
  if (args.length === 1) (end = start, start = 0);
  let result = [];
  for (let i = start; i < end; i += step) { result.push(i);  }
  return result;
} 

export default range;