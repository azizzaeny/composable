var escape = (str) =>  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); 

export default escape;