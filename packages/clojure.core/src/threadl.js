var threadl = (val, ...forms) => {
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){
      let fns = partialRight(fn, ...rest);
      return fns(acc);      
    }else{
      return fn(acc);      
    }
  }, val);
} 

export default threadl;