/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* @pirates: ignore */
var pirates = require('../../../');

var revert = pirates.addHook(compiler);

function compiler(code, filename) {
  revert();
  return 'var injectedVar = true;\n' + code;
}

