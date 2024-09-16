var subvec = (...[v, start, end]) => {
  if(!end) end = v.length;
  if(start < 0 || end < 0) return null;
  return v.slice(start, end);
} 

export default subvec;