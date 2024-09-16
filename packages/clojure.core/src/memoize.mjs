var memoize = (f) =>{
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (!cache.has(key)) {
      const result = f(...args);
      cache.set(key, result);
      return result;
    }
    return cache.get(key);
  };
} 

export default memoize;