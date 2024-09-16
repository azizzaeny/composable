var randNth = (coll) => {
  let i = Math.floor(Math.random() * coll.length);
  return coll[i];
}; 

export default randNth;