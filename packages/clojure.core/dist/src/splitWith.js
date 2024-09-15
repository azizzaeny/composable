var splitWith = (pred, coll) => {
  let index = coll.findIndex(element => !pred(element));
  if (index === -1) {
    return [coll, []];
  }
  return [coll.slice(0, index), coll.slice(index)];
}; 

export default splitWith;