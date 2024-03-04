var pool = () => fetch(window.location.origin+window.location.pathname, {method: 'POST'}).then(res=> res.text()).then(res => (console.log('recieve', res.length), res)).then((res)=> eval(res)).finally(_=> pool());

