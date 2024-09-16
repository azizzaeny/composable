var interpose = (...args) => {
  let [sep, coll] = args;
  if (args.length === 1) {
    return coll => coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } else {
    return coll.flatMap((val, i) => i === coll.length - 1 ? val : [val, sep]);
  } 
} 

export default interpose;