var renameKeys = (...[m, ksmap]) => {
  if(!ksmap) return (ksmap) => renameKeys(m, ksmap);
  return Object.entries(m).reduce((acc, [key, value]) => ksmap[key] ? { ...acc, [ksmap[key]]: value } : { ...acc, [key]: value }, {});
} 

export default renameKeys;