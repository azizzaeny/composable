var hiccup = hiccup || {};

var isSelfClosing = (tag) =>  {
  const tags = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'
  ];
  return tags.includes(tag.toLowerCase());
}

var isSVG = (tag) => {
  let svgTags = [
    'svg', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'path', 
    'text', 'g', 'defs', 'symbol', 'use', 'image', 'clipPath', 'mask', 
    'pattern', 'linearGradient', 'radialGradient', 'filter', 'foreignObject'
  ];
  if(!tag) return false;
  return svgTags.includes(tag.toLowerCase());
}


hiccup.createElement = (hnode) => {
  if(!hnode) return;
  if(typeof hnode === "string") return document.createTextNode(hnode);
  let [tagName, attrs, ...children] = hnode;
  /*create node*/
  let elementNode = isSVG(tagName) ? document.createElementNS("http://www.w3.org/2000/svg", tagName) : document.createElement(tagName);    
  /*create attribute*/
  if(attrs === null){ attrs = {} };  
  if(typeof attrs === "String"){
    attrs = {"class": attrs};
  };  
  /*functions event attribute*/
  for (let attrName in attrs){
    if(attrName.startsWith('on') && typeof attrs[attrName] === 'function'){
      let eventName = attrName.substring(2);
      elementNode.addEventListener(eventName, attrs[attrName]);
    } else {
      elementNode.setAttribute(attrName, attrs[attrName]);
    }
  }
  /*create children */
  if(typeof children === "string"){
    elementNode.appendChild(createElement(children));
    return elementNode;
  }
  if(Array.isArray(children)){
    for(let child of children){
      elementNode.appendChild(createElement(child));
    }
  }  
  return elementNode;
}

hiccup.render = (hnode, container) =>{
  container.innerHTML= ''; // remove from mem
  container.appendChild(hiccup.createElement(hnode));
  return true;
}

hiccup.toHiccup = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');  
  function parseNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim() !== '' ? node.textContent.trim() : null;
    }    
    const attributes = {};
    for (const attr of node.attributes) {
      attributes[attr.name] = attr.value;
    }    
    const children = Array.from(node.childNodes).map(parseNode).filter(Boolean);    
    return [node.tagName.toLowerCase(), attributes, ...children];
  }  
  const root = doc.body.firstChild;
  return parseNode(root);
}

hiccup.toString = (hnode) => {
  if(!hnode) return;
  if (typeof hnode === "string")  return hnode;
  let [tagName, attrs, ...children] = hnode;
  /* create attributes*/
  let attributes = '';
  for (let attrName in attrs) {
    attributes += ` ${attrName}="${attrs[attrName]}"`;
  }
  /*create a whole html tag*/
  let result = `<${tagName}${attributes}`;  
  /*create children*/
  if (isSelfClosing(tagName)) {
    result += '/>';
  } else {
    let childrenString = children.map(toString).join('');
    result += `>${childrenString}</${tagName}>`;
  }
  return result;
}
