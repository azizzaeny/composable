import assoc from "./assoc.js";



var assocIn =(...[m, ks, v]) => {
  if(!ks || !v) return (ks, v) => assocIn(m, ks, v);
  if(!v) return (v) => assocIn(m, ks, v);
  let keys = Array.isArray(ks) ? ks : [ks];
  let [fk, ...rk] = keys;
  let val = rk.length === 0 ? v : assocIn(m[fk] || {}, rk, v);
  return assoc(m, fk, val);
}  

export default assocIn;