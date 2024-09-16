var mapIndexed = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map((val, idx)=> f(val, idx)); 

export default mapIndexed;