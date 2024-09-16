var assoc = (...[m, key, val]) => {
  if(!key && !val) return (key, val) => assoc(m, key, val);
  if(!val) return (val) => assoc(m, key, val);
  if(isMap(m)) return {...m, [key]: val};
  if(isColl(m)){
    let coll = [...m];
    return (coll[key] = val ,coll);
  }
} 

export default assoc;