var find = (...[map, key]) => {
  if(!key) return (key) => find(map, key);
  return Object.entries(map).find(([k, v])=> k === key);
} 

export default find;