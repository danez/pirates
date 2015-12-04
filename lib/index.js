/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var Module = require('module');
var path = require('path');

var ignoreRe = /(\@pirates\s*:\s*ignore)/i;
var thisDir = path.resolve(__dirname); // FIXME: We need this for testing, but it's a nasty solution.

function shouldCompile(filename, code, matcher) {
  if (typeof filename !== 'string') return false;
  filename = path.resolve(filename);
  if (filename.indexOf('node_modules') !== -1 ||
      filename.indexOf(thisDir) !== -1 ||
      ignoreRe.test(code)) return false;
  if (matcher && typeof matcher === 'function') return matcher(filename);
  return true;
}

function addCompiler(exts, matcher, hook) {
  if (arguments.length === 2) {
    if (typeof exts === 'function') {
      hook = matcher;
      matcher = exts;
      exts = null;
    } else {
      hook = matcher;
      matcher = null;
    }
  }
  if (arguments.length === 1) {
    hook = exts;
    exts = null;
  }
  if (!exts) exts = ['.js'];
  if (!Array.isArray(exts)) exts = [exts];
  exts.forEach(function registerExtension(ext) {
    var oldLoader = Module._extensions[ext] || Module._extensions['.js'];
    Module._extensions[ext] = function newLoader(mod, filename) {
      var compile = mod._compile;

      mod._compile = function fakeCompile(code /*, filename*/) {
        if (shouldCompile(filename, code, matcher)) code = hook(code, filename);
        return compile.call(mod, code, filename);
      };

      oldLoader(mod, filename);
    };
  });
}

module.exports = {
  addCompiler: addCompiler,
};
