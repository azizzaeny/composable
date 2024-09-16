var apply = (...argv) => {
  let [fn, ...args] = argv;  
  return (argv.length === 1) ? (argn) => apply(fn, argn) : fn(...args);
} 

export default apply;