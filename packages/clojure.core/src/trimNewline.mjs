var trimNewline = (str) => {
  return str.replace(/^[\n\r]+|[\n\r]+$/g, '');
} 

export default trimNewline;