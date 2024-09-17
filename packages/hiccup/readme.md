## @zaeny/hiccup

[![npm version](https://img.shields.io/npm/v/@zaeny/hiccup.svg)](https://www.npmjs.com/package/@zaeny/hiccup)
![npm downloads](https://img.shields.io/npm/dm/@zaeny/hiccup.svg)  


> VDOM representation in hiccup

Simple UI building with hiccup nested data structure     


- [Geting Started](#getting-started)
- [Usage](#usage)
- [API](#api)
- [Related work](#related-work)
- [Changes](#changes)

### Getting started 

**npm common js**

```shell 
npm i @zaeny/hiccup
```
```js
var {render, toHiccup, toString} = require('@zaeny/hiccup');
```

note please use your favorite cdn
- unpkg -`https://www.unpkg.com/@zaeny/hiccup@1.0.2/dist/index.js`
- jsdelivr - `https://fastly.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.js`

**in browser common js**
```html
<script src="https://cdn.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.js"></script>
```
**in browser es5 global vars** 

```html
<script src="https://cdn.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.def.js"></script>
```

**in browser es6**
```html
<script type="module" src="https://cdn.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.es6.js"></script>
```
**in browser es6 import**
```js
import {render, toHiccup, toString} from 'https://cdn.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.es6.js';
```
**browser es6 import function**

```js

var assignVar = (global) => res => Object.assign(global, { hiccup: res.default });
import("https://cdn.jsdelivr.net/gh/azizzaeny/hiccup@main/dist/index.es6.js").then(assignVar(window));
```

### usage

```js

var component = (props) => (["div", "container", ["div", {class: "w-10"}, "look iam hiccup"]]);

// render(<<hiccup>>, <<elementContainer>>
render(component(), document.body );

// more children example
render(
  ["div", {class: "container"},
   ["p", {class: "leading"}, "Hi"],
   ["p", {}, "my name is hiccup"]
  ],
  document.body
);

toHiccup('<div>hai</div>'); // ["div", {}, "hai"]
toString(["div", {class: "foo bar"}, ["div", {}, "hail"]]); // <div class="foo bar"><div>hail</div></div>

```

### Api
```js
createElement(hnode),
render(container, hnode)
toHiccup(str)
toString(hnode) 
```

### Related work
- [Composable](https://github.com/azizzaeny/composable/tree/main) - Collection of functions to solve programming problem

### Changes
- [1.0.0] add `createElement`, `render`, `toHiccup`
- [1.0.1] add `svg` rendering in renderNode
- [1.0.2] add `toString` to render html string
- [1.0.3] seperate `toString` to its own file
