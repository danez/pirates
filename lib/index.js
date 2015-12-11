/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var Module = require('module');
var path = require('path');
var nodeModulesRegex = require('node-modules-regexp');

var HOOK_RETURNED_NOTHING_ERROR_MESSAGE = '[Pirates] A hook returned a non-string, or nothing at all! This is a' +
                                          ' violation of intergalactic law!\n' +
                                          '--------------------\n' +
                                          'If you have no idea what this means or what Pirates is, let me explain: ' +
                                          'Pirates is a module that makes is easy to impliment require hooks. One of' +
                                          ' the require hooks you\'re using uses it. One of these require hooks' +
                                          ' didn\'t return anything from it\'s handler, so we don\'t know what to' +
                                          ' do. You might want to debug this.';

function shouldCompile(filename, matcher, ignoreNodeModules) {
  if (typeof filename !== 'string') return false;
  filename = path.resolve(filename);
  if (ignoreNodeModules && nodeModulesRegex.test(filename)) return false;
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
  ignoreNodeModules = opts.ignoreNodeModules !== false;
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

          if (shouldCompile(filename, matcher, ignoreNodeModules)) {
            newCode = hook(code, filename);
            if (!newCode || typeof newCode !== 'string') {
              throw new Error(HOOK_RETURNED_NOTHING_ERROR_MESSAGE);
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
