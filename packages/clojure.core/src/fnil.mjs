var fnil = (f, x) =>{
  return function() {
    const args = Array.from(arguments);
    const numArgs = f.length;
    while (args.length < numArgs) { args.push(x); }
    return f.apply(null, args);
  };
} 

export default fnil;