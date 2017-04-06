/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* eslint no-var:0, prefer-const: 0, vars-on-top: 0, object-shorthand:0 */
import decache from 'decache';
import path from 'path';

function assertModule(t, filename, expected) {
  var absFilename = path.join(__dirname, '../fixture', filename);
  decache(absFilename);

  return t.is(require(absFilename), expected);
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
