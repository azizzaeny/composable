## @zaeny/repl

Bringing Clojure Repl Like Experiences to the Javascript Node.js, add support evaluating in context, or in-ns

{wip}

{todo: explain}

{todo: usage}

### Changes
- 1.0.1 fix `require` context, and add `__dirname` into global and module context evaluation
- 1.0.2 add last value saved at `__value` and `__error`, add support for markdown extension `.md`
- 1.0.3 add `defaultBeforEvalHook` in  `evaluate` function,  fix `defaultTransformer` code
- 1.0.4 add `provide`, `loadCodeAt`, `exposeContext`, add try catch `evaluate`
- 1.0.5 fix `provide` not able to loadCodeAt
- 1.0.6 fix `console` not show up, and fix return value of `evaluate`
