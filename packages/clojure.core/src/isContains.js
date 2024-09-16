var isContains = (...args)=>{
  let [coll, key] = args;
  if(args.length === 1) return (keyN) => isContains(coll, keyN);
  if (coll instanceof Map || coll instanceof Set) {
    return coll.has(key);
  } else if (typeof coll === "object"){
    if(Array.isArray(coll)){
      return coll.includes(key);
    }else{
      return Object.prototype.hasOwnProperty.call(coll, key);
    }
  } else if (typeof coll === "string") {
    return coll.includes(key);
  } else {
    return false;
  }
}; 

export default isContains;