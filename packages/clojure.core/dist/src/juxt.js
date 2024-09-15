var juxt =(...fns) => {
  return function(...args) {
    return fns.map(function(fn) {
      return fn(...args);
    });
  };
} 

export default juxt;