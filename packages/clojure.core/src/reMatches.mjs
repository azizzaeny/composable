var reMatches = (...args) => {
  let [str, pattern] = args;
  if(args.length === 1) return (pattern) => reMatches(str, pattern);
  var regex = new RegExp(pattern, "g");
  var matches = [];
  var match;
  while ((match = regex.exec(str)) !== null) { matches.push(match[0]); }
  return matches;
} 

export default reMatches;