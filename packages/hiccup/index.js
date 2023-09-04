
export function createElement(hnode){
  /*
    create element from hiccup nodes   
    1. create element or text node
    2. create attributes
    3. cretae children recursiveley
  */
  
  if(typeof hnode === "string") return document.createTextNode(hnode);

  let [tagName, attrs, ...children] = hnode;
  
  let elementNode = document.createElement(tagName);

  if(attrs === null){ attrs = {} };
  
  for (let attrName in attrs){
    if(attrName.startsWith('on') && typeof attrs[attrName] === 'function'){
      let eventName = attrName.substring(2);
      elementNode.addEventListener(eventName, attrs[attrName]);
    } else {
      elementNode.setAttribute(attrName, attrs[attrName]);
    }
  }

  for(let child of children){
    elementNode.appendChild(createElement(child));
  }
  return elementNode
}

export function toString(hnode){
  return '';
}

export function render(container, hnode){
  container.innerHTML= ''; // remove from mem
  container.appendChild(createElement(hnode));
  return true;
}
