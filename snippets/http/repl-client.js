/*util*/
var merge = (...args) => {
  let [obj1, obj2] = args;
  if(args.length === 1) return (obj1) => merge(obj1, obj2);
  return Object.assign({}, ...args);
}

var responseWrite = (ctx, response) => (ctx) ? (
  response.writeHead(ctx.status, ctx.headers),
  response.write(ctx.body),
  response.end()
) : (null);

var clientRequest = clientRequest || [];

var cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'  
};

var responseBuffer = (request, response) => (clientRequest.push({request, response}), null);

var responseWith = (body) => (
  clientRequest.forEach(({response}) => responseWrite({status: 200, headers: cors, body }, response)),
  clientRequest = []
);

var clientReplJs = (hostUri) => `
esprima = window.esprima || {} ;
escodegen = window.escodegen || {};
howTo = () => console.log('usage: interactive client development with repl, first initiate dependencies and start pulling by typing  dev() at console');
assignVar = (global, name) => res => Object.assign(global, { [name]: (res.default) });
parseCode = (code, es5) => {
  if(es5){
    return esprima.parseScript(code, { range: true, tolerant: true});
  }else{
    return esprima.parseModule(code, { range: true, tolerant: true });
  }
}
generateCode = (ast) => {
  return escodegen.generate(ast);
}
nodeType = {
  'VariableDeclaration': (node)=>{
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": node.declarations[0].id,        
        "right": node.declarations[0].init,
        "range": []
      },
      "range": node.range
    }
  },
  'FunctionDeclaration': (node)=>{
    return {
      "type": "ExpressionStatement",
      "expression": {
        "type": "AssignmentExpression",
        "operator": "=",
        "left": node.id,        
        "right": {
          "type": "ArrowFunctionExpression",
          "id": null,
          "params": node.params,
          "body": node.body
        },
        "range": []
      },
      "range": node.range
    }
  }
}
traverse  = (acc, node, index) => {
  if(nodeType[node.type]){
    let transform = nodeType[node.type](node);
    return acc.concat(transform);
  }else{
    return acc.concat(node);
  }
}
transformCode = (ast) => {
  return {
    ...ast,
    body: ast.body.reduce(traverse, []).flat().filter(e=> e !== null),
    sourceType: "module",
    ecmaVersion: "latest"
  }
}
generateSafeCode = (code, context) => {
  return generateCode(transformCode(parseCode(code)));
}
evalJs = (res) => {
  try{
    let out = eval(generateSafeCode(res));
    if(out) console.log(out);
    return Promise.resolve('evaluate');
  } catch(e){
    return Promise.reject(e);
  }
}
requestPoll = (url) => fetch(url).then(res => res.text()).then(evalJs).catch(err => console.error(err)).finally((res) => (setTimeout(()=> requestPoll(url, 100), console.log(res)))) ;
dev = () => {
  Promise.all([
    import('https://cdn.jsdelivr.net/npm/esprima@4.0.1/+esm').then(assignVar(window, "esprima")),
    import('https://cdn.jsdelivr.net/npm/escodegen@2.1.0/+esm').then(assignVar(window, "escodegen"))
  ]).then(() => requestPoll("${hostUri}"));
  return 'evaluated';
}
`;

var clientRepl = (hostUri) => (req, res) => ({
  status: 200,
  body: clientReplJs(hostUri),
  headers: merge(cors, {"Content-Type": 'application/javascript'})
});

