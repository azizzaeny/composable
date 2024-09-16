// todo: fix disj
var disj = (...[st, k, ...ks]) =>{
  if(!k) return (k, ...ks) => disj(st, k, ...ks);
  return st.filter(item => item !== k)
} 

export default disj;