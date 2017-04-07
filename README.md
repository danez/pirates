# Pirates
---

### Properly hijack require

[//]: # "ProTip(tm): This is how you make a comment in markdown. Anything between the quotes is ignored."

---
[//]: # "I'm on the fence about having this here, as we don't actually use pirates"
[![Beware: Pirates!][pirates-badge]][pirates-link]
[![Version][version-badge]][npm-link]
[![Downloads][downloads-badge]][npm-link]
[![Build Status][build-badge]][build-link]
[![Dependency Status][deps-badge]][deps-link]
[![devDependency Status][devDeps-badge]][devDeps-link]
[![Commitizen friendly][cz-badge]][cz-link]
[![semantic-release][sr-badge]][sr-link]
[![MIT License][license-badge]][license-link]


[version-badge]: 	https://img.shields.io/npm/v/pirates.svg   "npm version"
[downloads-badge]: https://img.shields.io/npm/dm/pirates.svg "npm downloads"
[npm-link]:  http://npm.im/pirates                           "npm"

[license-badge]: https://img.shields.io/npm/l/express.svg    "MIT License"
[license-link]:  http://ariporad.mit-license.org             "MIT License"

[build-badge]: https://travis-ci.org/ariporad/pirates.svg                   "Travis CI Build Status"
[build-link]:  https://travis-ci.org/ariporad/pirates                       "Travis CI Build Status"

[deps-badge]: https://img.shields.io/david/ariporad/pirates.svg             "Dependency Status"
[deps-link]:  https://david-dm.org/ariporad/pirates                         "Dependency Status"

[devDeps-badge]: https://img.shields.io/david/dev/ariporad/pirates.svg      "devDependency Status"
[devDeps-link]:  https://david-dm.org/ariporad/pirates#info=devDependencies "devDependency Status"

[pirates-badge]: http://ariporad.link/pirates-badge "Beware: Pirates!"
[pirates-link]: https://github.com/ariporad/pirates "Beware: Pirates!"

[cz-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg "Commitizen friendly"
[cz-link]: http://commitizen.github.io/cz-cli/                               "Commitizen friendly"

[sr-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[sr-link]: https://github.com/semantic-release/semantic-release

[//]: # "This comes last, as it's really long"
[//]: # "These are currently disabled"
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
  
  old(mod, filename);
}

function matcher(filename) {
  // Here, you can inspect the filename to determine if it should be hooked or 
  // not. Just return a truthy/falsey. Files in node_modules are automatically ignored, unless otherwise specified (see below).
  
  // TODO: Implement logic
  return true;
}

// Now you can just do this!:
var revert = pirates.addHook(function hook(code, filename) {
  return code.replace('@@foo', 'console.log(\'foo\');');
}, { exts: ['.js'], matcher: matcher });

// And later, if you want to un-hook require, you can just do:
revert();
```

Then when you add pirates to your module, add this badge to your README.md:

[![Beware: Pirates!](http://ariporad.link/pirates-badge)](https://github.com/ariporad/pirates "Beware: Pirates!")

```markdown
[![Beware: Pirates!](http://ariporad.link/pirates-badge)](https://github.com/ariporad/pirates "Beware: Pirates!")
```

---

## API

### pirates.addHook(hook, [opts={ [matcher: true], [exts: ['js']], [ignoreNodeModules: true] }]);
Add a require hook. `hook` must be a function that takes `(code, filename)`, and returns the modified code. `opts` is
an optional options object. Available options are: `matcher`, which is a function that accepts a filename, and 
returns a truthy value if the file should be hooked (defaults to a function that always returns true), falsey if 
otherwise; `exts`, which is an array of extensions to hook, they should begin with `.` (defaults to `['.js']`); 
`ignoreNodeModules`, if true, any file in a `node_modules` folder wont be hooked (the matcher also wont be called), 
if false, then the matcher will be called for any files in `node_modules` (defaults to true).


---

## Pirates and bundling-specific require syntax

Pirates can intercept `require()` calls, but relies on Node to first resolve the content by loading in the requested file and extracting its data as string. This means that Pirates will not be able to hook into require calls that use custom bundler-specific syntax, such as Webpack's ["inline" loader syntax](https://webpack.github.io/docs/loaders.html). The following `require` call will work with a webpack config with the appropriate loader bound, for instance, but will not work properly in a plain Node.js + Pirates setting:

```
require('file!./data.txt?name=new.file.name');
```

Pirates does not get to modify the filename before Node tries to load in the file, and so Node will try to load a file from the literal path `file!./data.txt?name=new.file.name`, which will fail and result in a runtime error.

If you need custom requires like this, you will need to use the plain require call in your scripts, with your bundler set to automatically look for these custom require extensions. This means in your scripts using:

```
require('./data.txt');
```

and then have your bundler perform (pre)processing based on the extension, such as by using Webpack's loaders [by config](https://webpack.github.io/docs/loaders.html#loaders-by-config), instead.


---

## Projects that use Pirates

See the [wiki page](https://github.com/ariporad/pirates/wiki/Projects-using-Pirates). If you add Pirates to your project,
(And you should! It works best if everyone uses it. Then we can have a happy world full of happy require hooks!), please
add yourself to the wiki.

---

## License

[MIT: ariporad.mit-license.org.](http://ariporad.mit-license.org)
