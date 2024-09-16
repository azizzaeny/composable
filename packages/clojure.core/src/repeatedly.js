var repeatedly = (...args) => {
  let n, fn;
  if(args.length === 1) (fn = args[0]);
  if(args.length === 2) (n=args[0], fn = args[1]);
  if (n === undefined) {
    return function* () {
      while (true) {
        yield fn();
      }
    };
  } else {
    return Array.from({ length: n }, () => fn());
  }
}; 

export default repeatedly;