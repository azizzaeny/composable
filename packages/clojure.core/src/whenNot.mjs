var whenNot = (test, ...body) => {
  if (!test) { body.forEach(fn => fn()); }
}; 

export default whenNot;