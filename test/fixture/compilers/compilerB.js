/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* @pirates: ignore */
var path = require('path');
var pirates = require('../../../');

var oldLoader = require.extensions['.js'];
require.extensions['.js'] = function loader(mod, filename) {
  var _compile = mod._compile;
  mod._compile = function newCompile(code, filename) {
    if(path.resolve(filename, '..') === __dirname) return _compile.call(mod, code, filename);
    return _compile.call(mod, code.replace('@@macroB', '@@macroC; console.log(\'in macroB\')'), filename);
  };
  oldLoader(mod, filename);
};

