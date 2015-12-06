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
  if (matcher && typeof matcher === 'function') return !!matcher(filename);
  return true;
}

/**
 *
 * Add a require hook.
 *
 * @param {String[]} [exts=['.js']] - The extensions to hook.
 * @param {Function} [matcher] - A function to determine if the given file should be hooked. Accepts the filename,
 * returns a boolean. Defaults to returning true. *NOTE:* files in `node_modules`, and containing `@pirates: ignore`
 * are auto-ignored.
 * @param {Function} hook - The hook. Accepts the code of the module and the filename. Required.
 * @returns {Function} revert - Reverts the hooks.
 */
function addHook(hook, _opts) {
  var reverted = false;
  var opts = _opts || {};
  var matcher = opts.matcher || null;
  //var ignoreNodeModules = opts.ignoreNodeModules || !opts.node_modules || true;
  var exts = opts.extensions || opts.exts || opts.extension || opts.ext || ['.js'];
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

          if (shouldCompile(filename, code, matcher)) {
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
