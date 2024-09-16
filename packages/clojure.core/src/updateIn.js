import update from "./update.js";


var updateIn = (...[m, ks, fn]) =>{
  if(!ks || !fn) return (ks, fn) => updateIn(m, ks, fn);
  if(!fn) return (fn) => updateIn(m, ks, fn);
  let [k, ...rk] = ks;
  return (rk.length === 0)
    ? update(m, k, fn)
    : update(m, k, (v) => updateIn(v, rk, fn));  
}

export default updateIn;