/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var Module = require('module');
var path = require('path');

var ignoreRe = /(\@pirates\s*:\s*ignore)/i;

function shouldCompile(filename, code, matcher, ignoreNodeModules) {
  if (typeof filename !== 'string') return false;
  filename = path.resolve(filename);
  if (ignoreNodeModules && filename.split(path.sep).indexOf('node_modules') !== -1) return false;
  if (ignoreRe.test(code)) return false;
  if (matcher && typeof matcher === 'function') return !!matcher(filename);
  return true;
}

/**
 *
 * Add a require hook.
 *
 * @param {Function} hook - The hook. Accepts the code of the module and the filename. Required.
 * @param {Object} [opts] - Options
 * @param {String[]} [opts.exts=['.js']] - The extensions to hook. Should start with '.' (ex. ['.js']).
 * @param {Function(path)} [opts.matcher] - A matcher function, will be called with path to a file. Should return truthy if the file should be hooked, falsy otherwise.
 * @param {Boolean} [opts.ignoreNodeModules=true] - Auto-ignore node_modules. Independent of any matcher.
 * @returns {Function} revert - Reverts the hooks.
 */
function addHook(hook, opts) {
  var reverted = false;
  var matcher, exts, ignoreNodeModules;

  opts = opts || {};
  matcher = opts.matcher || null;
  ignoreNodeModules = opts.ignoreNodeModules || true;
  exts = opts.extensions || opts.exts || opts.extension || opts.ext || ['.js'];
  if (!Array.isArray(exts)) exts = [exts];

  exts.forEach(function registerExtension(ext) {
    var oldLoader;
    if (typeof ext !== 'string') throw new TypeError('Invalid Extension: ' + ext);
    oldLoader = Module._extensions[ext] || Module._extensions['.js'];

    Module._extensions[ext] = function newLoader(mod, filename) {
      var compile;
      if (!reverted) {
        compile = mod._compile;
        mod._compile = function fakeCompile(code /*, filename*/) {
          var newCode = code;

          if (shouldCompile(filename, code, matcher, ignoreNodeModules)) {
            newCode = hook(code, filename);
            if (!newCode || typeof newCode !== 'string') {
              console.error('Hook didn\'t return anything (or returned a non-string)! This is bad! If you don\'t want' +
                            ' to hook the module, just return the original code! Assuming that\'s what you meant to do.');
              newCode = code;
            }
          }
          return compile.call(mod, newCode, filename);
        };
      }
      oldLoader(mod, filename);
    };
  });
  return function revert() {
    reverted = true;
  };
}

module.exports = {
  addHook: addHook, // TODO: Maybe just export addHook?
};
