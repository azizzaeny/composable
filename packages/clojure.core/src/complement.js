var complement = (f) => {
  return function(...args) {
    return !f(...args);
  };
}

var complement = (f) => {
  return (...args) => !f(...args);
}; 

export default complement;