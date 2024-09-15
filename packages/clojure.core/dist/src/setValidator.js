var setValidator = (...args) => {
  let [atom, validatorFn] = args;
  if(args.length === 1) return (validatorFn) => atom.setValidator(validatorFn);
  return atom.setValidator(validatorFn);
} 

export default setValidator;