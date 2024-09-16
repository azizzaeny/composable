var concat = (...[x,...zs]) => {
  if(!zs) return (...zs) => concat(x, ...zs);
  return x.concat(...zs);
} 

export default concat;