var doseq = (seq, bodyFn) => {
  seq.forEach(item => bodyFn(item) );
}; 

export default doseq;