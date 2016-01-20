/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* eslint no-var:0, prefer-const: 0, vars-on-top: 0, object-shorthand:0 */
// This is not ES6, AVA doesn't transpile it.
var path = require('path');

function assertModule(t, _filename, expected) {
  var filename = path.join('fixture', _filename);
  // The path nonsense is to make it an absolute path
  delete require.cache[path.resolve(process.cwd(), filename)];
  return t.same(require('./' + filename), expected);
}

function makeNonPiratesHook(macro, value) {
  var oldLoader = require.extensions['.js'];
  require.extensions['.js'] = function loader(mod, filename) {
    var _compile = mod._compile;
    mod._compile = function newCompile(code) {
      if (path.resolve(filename, '..') === __dirname) return _compile.call(mod, code, filename);
      return _compile.call(mod, code.replace(macro, value), filename);
    };
    oldLoader(mod, filename);
  };
}

module.exports = {
  assertModule: assertModule,
  makeNonPiratesHook: makeNonPiratesHook,
};
