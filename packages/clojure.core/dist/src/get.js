var get = (...[map, key]) =>{
  if(!key) return (key) => map[key];
  return map[key];
} 

export default get;