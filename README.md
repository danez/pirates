# Pirates
---

### Properly hijack require

[//]: # "ProTip(tm): This is how you make a comment in markdown. Anything between the quotes is ignored."

---
[![Version][version-badge]][version-link]
[![Build Status][build-badge]][build-link]
[![Coverage Status][coverage-badge]][coverage-link]
[![Dependency Status][deps-badge]](deps-link)
[![devDependency Status][devDeps-badge]][devDeps-link]

[version-badge]: https://badge.fury.io/js/pirates.svg         "npm version"
[version-link]:  http://badge.fury.io/js/pirates              "npm version"

[build-badge]: https://travis-ci.org/ariporad/pirates.svg                   "Travis CI Build Status"
[build-link]:  https://travis-ci.org/ariporad/pirates                       "Travis CI Build Status"

[deps-badge]: https://david-dm.org/ariporad/pirates.svg                     "Dependency Status"
[deps-link]:  https://david-dm.org/ariporad/pirates                         "Dependency Status"

[devDeps-badge]: https://david-dm.org/ariporad/pirates/dev-status.svg       "devDependency Status"
[devDeps-link]:  https://david-dm.org/ariporad/pirates#info=devDependencies "devDependency Status"

[//]: # "This comes last, as it's really long"

[coverage-badge]: https://coveralls.io/repos/ariporad/pirates/badge.svg?branch=master&service=github "Code Coverage"
[coverage-link]: https://coveralls.io/github/ariporad/pirates?branch=master                          "Code Coverage"

---

## Why?

Two reasons:
1. Babel and istanbul were breaking each other.
2. Everyone seemed to re-invent the wheel on this, and everyone wanted a solution that was DRY, simple, easy to use, 
and made everything Just Work™, while allowing multiple require hooks, in a fashion similar to calling `super`.

For some context, see [the Babel issue thread][] which started this all, then [the nyc issue thread][], where 
discussion was moved (as we began to discuss just using the code nyc had developed), and finally to [#1][issue-1] 
where discussion was finally moved.

[the Babel issue thread]: https://github.com/babel/babel/pull/3062 "Babel Issue Thread"
[the nyc issue thread]: https://github.com/bcoe/nyc/issues/70 "NYC Issue Thread"
[issue-1]: https://github.com/ariporad/pirates/issues/1 "Issue #1"

---

## Installation

    npm install --save pirates

---

## Usage

Using pirates is really easy:
```javascript
// my-module/register.js
var pirates = require('pirates');

// Instead of messing with require like this:
var old = require.extensions['.js'];
require.extensions['.js'] = function (mod, filename) {
  var compile = mod._compile;
  
  mod._compile = function (code, filename) {
    code = myLib.compileFile(code, filename);
    compile.call(mod, code, filename);
  }
  
  old.apply(this, arguments);
}

// Now you can just do this!:
pirates.addHook(['.js'], function matcher(filename) {
  // Here, you can inspect the filename to determine if it should be hooked or not. Just return a boolean. Files in 
  // node_modules are automatically ignored.
  
  // TODO: Implement logic
  return true;
}, function hook(code, filename) {
  return code.replace('@@foo', 'console.log(\'foo\');');
});
```

---

## API

### pirates.addHook([exts], [matcher], hook);
Add a require hook. `exts` is optional and defaults to ['.js'], for convenience, if you only want to hook one extension,
you can just pass a string. `matcher` is a function which accepts a filename and returns a boolean indicating if the 
file should be hooked (note: files in node_modules are automatically ignored, regardless of `matcher`). `matcher` 
defaults to always true. `hook` is the actual require hook. It accepts two arguments, the code to 
transpile/instrument/whatever and the filename of the module. It must return the new code of the module.


---

## Contributing

PRs are welcome!

Please make sure to add tests for anything you add/fix. Run the tests (and lint your code,) with:

    npm run test




---

## License

[MIT: ariporad.mit-license.org.](http://ariporad.mit-license.org)
