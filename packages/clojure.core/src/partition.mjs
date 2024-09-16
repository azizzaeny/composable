// todo: multi arity arguments, step, and so on
var partition=(...args) =>{
  let [n, coll] = args;
  if(args.length === 1) return (coll) => partition(n, coll);
  let result = [];
  for (let i = 0; i < coll.length; i += n) { result.push(coll.slice(i, i + n));  }
  return result;
} 

export default partition;