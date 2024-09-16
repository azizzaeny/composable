// todo: check takeNth
var takeNth = (...[n, coll]) => {
  if(!coll) return (coll) => takeNth(n, coll);
  return coll.filter((_, i) => i % n === 0);
}

var takeNth = (...[n, coll]) => {
  if (!coll) return coll => takeNth(n, coll)
  return coll.filter((_, i) => i % n === 0);
} 

export default takeNth;