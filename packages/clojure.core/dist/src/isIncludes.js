var isIncludes = (s, substr) => {
  if(!substr) return (substr) => isIncludes(s, substr);
  return s.includes(substr)
} 

export default isIncludes;