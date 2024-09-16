## Composable  

> Composable aims to help you to "compose" or build solutions by combining smaller, modular parts.

Composable is a collection of reusable functions to solve programming problems through composition. It provides a toolkit for general-purpose functional programming, covering patterns, side-effect handling, and data structure algorithms.

### Core Packages

| Status      | Packages                    | Descriptions                                                                     |
|-------------|-----------------------------|--------------------------------------------------------------------------------- |
| beta        | [@zaeny/clojure.core](https://github.com/azizzaeny/composable/tree/main/packages/clojure.core)  | JavaScript implementation of Clojure core functions. |
| alpha       | [@zaeny/literate](https://github.com/azizzaeny/composable/tree/main/packages/literate)  | Literate programming, extracting code from markdown  code blocks. |
| alpha       | [@zaeny/env](https://github.com/azizzaeny/composable/tree/main/packages/env)  | Utility for reading .env files. |
| alpha       | [@zeny/hiccup](https://github.com/azizzaeny/composable/tree/main/packages/hiccup) | UI building utility functions inspired by Hiccup. |
| alpha       | [@zaeny/http](https://github.com/azizzaeny/composable/tree/main/packages/http) | Node.js utility functions for setting up HTTP servers. |
| alpha       | [@zaeny/redis](https://github.com/azizzaeny/composable/tree/main/packages/redis) | Functional utilities for interacting with Redis. |
| alpha       | [@zaeny/mongodb](https://github.com/azizzaeny/composable/tree/main/packages/mongodb) | Mongodb wrapper expose function `query` and `transact`. |
| alpha       | [@zaeny/expose](https://github.com/azizzaeny/composable/tree/main/packages/expose) | Utility Functions working with repl node.js |
| wip         | [@zaeny/aof](https://github.com/azizzaeny/composable/tree/main/packages/aol) | Simple Efficient appendonly log json |
| wip         | [@zaeny/mql](https://github.com/azizzaeny/composable/tree/main/packages/mql) | Mongodb Query Langauge in memory  |

### Getting Started 
#### Instalation
To install and use a package in Node.js, run the following command:

```
npm i @zaeny/{package}
```

#### Usage in REPL (without installation)
You can also use the packages directly in a Node.js REPL without downloading specific packages.
```sh
```

### Development Status
1. Planning:   
The package is in the idea or design phase.  
No code has been written yet, and the features are being outlined.  

2. WIP (Work in Progress):  
The package is actively being developed.  
Code exists, but it's not yet stable or fully functional.  
Breaking changes or incomplete features may still be present.  

3. Alpha:  
The package is in early development.  
Most core features are implemented, but testing is limited.  
Bugs and stability issues are likely, and APIs may change.  

3. Beta:  
The package is feature-complete.  
It is being tested, and there may be some minor bugs, but it is mostly stable.  
Ready for broader testing and feedback, but not recommended for production use.  

3. Stable:  
The package is fully developed and tested.  
It is considered reliable for production use.  
Only minor updates, bug fixes, and backward-compatible changes are expected.  

4. Deprecated:  
The package is no longer being actively maintained.  
It may still be functional but is not recommended for new projects.  
Security or functionality issues may not be addressed.  


### Contribution
{todo} development
