/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import decache from 'decache';
import path from 'path';

function assertModule(t, filename, expected) {
  const absFilename = path.join(__dirname, '../fixture', filename);
  decache(absFilename);

  return t.is(require(absFilename), expected);
}

function makeNonPiratesHook(macro, value) {
  const oldLoader = require.extensions['.js'];
  require.extensions['.js'] = function loader(mod, filename) {
    const { _compile } = mod;
    mod._compile = function newCompile(code) {
      if (path.resolve(filename, '..') === __dirname)
        return _compile.call(mod, code, filename);
      return _compile.call(mod, code.replace(macro, value), filename);
    };
    oldLoader(mod, filename);
  };
}

export { assertModule, makeNonPiratesHook };
