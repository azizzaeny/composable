var frequencies = (coll) => {
  let freqMap = new Map();
  for (const el of coll) { freqMap.set(el, (freqMap.get(el) || 0) + 1);  }
  return Object.fromEntries(freqMap);
} 

export default frequencies;