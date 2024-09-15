var mapcat = (...[f, ...coll]) => {
  if(!coll || coll.length === 0) return (...coll) => mapcat(f, ...coll);
  return coll.flat().map(f).reduce((acc, val) => acc.concat(val), [])
} 

export default mapcat;