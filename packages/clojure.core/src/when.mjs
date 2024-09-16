var when = (test, ...body) => {
  if (test) body.forEach(fn => fn());
}; 

export default when;