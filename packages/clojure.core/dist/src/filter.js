var filter = (...[pred, coll]) => (!coll) ? (coll) => filter(pred, coll) : coll.filter(pred); 

export default filter;