var dropWhile = (pred, coll) => {
  let index = 0;
  while (index < coll.length && pred(coll[index])) { index++;  }
  return coll.slice(index);
}; 

export default dropWhile;