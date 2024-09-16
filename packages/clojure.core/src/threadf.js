import partial from "./partial.js";


var threadf = (val, ...forms)=>{
  return forms.reduce((acc, form) => {
    let [fn, ...rest] = form;
    if(rest && rest.length > 0){      
      let fns = partial(fn, ...rest);
      return fns(acc);
    }else{
      return fn(acc);
    }
  }, val);
}

export default threadf;