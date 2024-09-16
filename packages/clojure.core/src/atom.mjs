var atom = (value) => {
  let state = value;
  let watchers = {};
  let validator = null;

  var deref = () =>  state;
  
  var reset = (newValue) => {
    let oldState = state;
    let validatedValue = validate(newValue);
    (state = validatedValue);
    (notifyWatchers(oldState, state));
    return (state === validatedValue); // Return true if the value passed validation
  }

  var swap = (updateFn) => {
    let oldValue = state;
    let newValue = updateFn(state);
    let validatedValue = validate(newValue);
    (state = validatedValue);
    (notifyWatchers(oldValue, state));
    return (state === validatedValue); // Return true if the value passed validation
  }

  var addWatch = (name, watcherFn) =>{
    (watchers[name] = watcherFn);
    return true;
  }

  var removeWatch = (name) => {
    delete watchers[name];
  }
  
  var notifyWatchers = (oldState, newState) => {
    for (const watcherName in watchers) {
      if (watchers.hasOwnProperty(watcherName)) {
        watchers[watcherName](oldState, newState);
      }
    }
  }
  
  var compareAndSet = (expectedValue, newValue) => {
    if (state === expectedValue) {
      let validatedValue = validate(newValue);
      (state = validatedValue);
      (notifyWatchers(expectedValue, state));
      return state === validatedValue; 
    }
    return false;
  }

  var setValidator = (validatorFn) => {
    (validator = validatorFn);
  }


  var removeValidator = () => {
    (validator = null);
  }
  

  var validate = (newValue) => {
    let defaultValidation = validator ? validator(newValue) : true;
    return defaultValidation ? newValue : state; // Return current state if validation fails
  }

  // # todo: getValidator
  return {
    deref,
    reset,
    swap,
    addWatch,
    removeWatch,
    compareAndSet,
    setValidator,
    removeValidator
  };
} 

export default atom;