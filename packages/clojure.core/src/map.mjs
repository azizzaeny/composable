var map = (...[f, coll]) => (!coll) ? (coll) => map(f, coll) : coll.map(f); 

export default map;