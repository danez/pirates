/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var Module = require('module');
var path = require('path');

var thisDir = path.resolve(__dirname); // FIXME: We need this for testing, but it's a nasty solution.

function shouldCompile(filename, matcher) {
  if (typeof filename !== 'string') return false;
  filename = path.resolve(filename);
  if (filename.indexOf('node_modules') !== -1) return false;
  if (filename.indexOf(thisDir) !== -1) return false;
  if (matcher && typeof matcher === 'function') return matcher(filename);
  return true;
}

function addCompiler(exts, matcher, hook) {
  exts.forEach(function registerExtension(ext) {
    var oldLoader = Module._extensions[ext] || Module._extensions['.js'];
    Module._extensions[ext] = function newLoader(mod, filename) {
      var compile = mod._compile;

      if (shouldCompile(filename, matcher)) {
        mod._compile = function fakeCompile(code/*, filename */) {
          var newCode = hook(code, filename);
          return compile.call(mod, newCode, filename);
        };
      }

      oldLoader(mod, filename);
    };
  });
}

module.exports = {
  addCompiler: addCompiler,
};
