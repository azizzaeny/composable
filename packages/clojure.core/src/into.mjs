// todo: fix into add xform
var into= (...[to, from]) =>{
  if(!from) return (from) => into(to, from);
  if(isMap(to)) return from.reduce((acc, [key, value])=> ({...acc, [key]:value}),{});
  return Object.entries(from).map(([key, value]) => [key, value]);
} 

export default into;