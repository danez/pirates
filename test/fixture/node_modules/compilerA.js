/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* @pirates: ignore */
var pirates = require('../../../');

function compiler(code, filename) {
  return code.replace('@@macroA', '@@macroB; console.log(\'in macroA\')');
}

pirates.addHook(compiler);

