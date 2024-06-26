
var createElement = (hnode) => {
  if(typeof hnode === "string") return document.createTextNode(hnode);
  let [tagName, attrs, ...children] = hnode;
  /*create node*/
  let elementNode = document.createElement(tagName);

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
  for(let child of children){
    elementNode.appendChild(createElement(child));
  }
  
  return elementNode;

}

var render = (container, hnode) =>{
  container.innerHTML= ''; // remove from mem
  container.appendChild(createElement(hnode));
  return true;
}

var toString = (hnode) => {
  //TODO
}

var toHiccup = (htmlString) => {
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

export default {toHiccup, toString, render}
