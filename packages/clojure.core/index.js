
/*
(get map key)(get map key not-found)

Returns the value mapped to key, not-found or nil if key not present
in associative collection, set, string, array, or ILookup instance.
TODO: not-found
*/

var get = (...args) => {
  let [obj, key] = args;
  if(args.length === 2){
    return obj[key];
  }else{
    return (keyA) => obj[keyA];
  }
}

/*
(get-in m ks)(get-in m ks not-found)

Returns the value in a nested associative structure,
where ks is a sequence of keys. Returns nil if the key
is not present, or the not-found value if supplied.

TODO: not-found
*/

var getIn = (...args)=>{
  let [coll, keys] = args;
  if(args.length === 2){
    return keys.reduce((acc, key) =>{
      if(acc && typeof acc === "object" && key in acc){
        return acc[key];
      }else{
        return undefined;
      }
    }, coll);
  }else{
    return (keysA) => geetIn(coll, keysA);
  }
}

module.exports = {get, getIn}
