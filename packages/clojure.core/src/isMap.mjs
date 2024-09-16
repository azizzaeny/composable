var isMap = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
var isObject = isMap; 

export default isMap;