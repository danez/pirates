/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var Module = require('module');
var path = require('path');
var debug = require('debug')('pirates');
var nodeModulesRegex = require('node-modules-regexp');

var HOOK_RETURNED_NOTHING_ERROR_MESSAGE = [
  'A hook returned a non-string, empty string, or nothing at all! This is bad!',
  new Array(80).join('-'),
  'If you have no idea what this means or what Pirates is, let me explain:',
  'Pirates is a module that makes is easy to impliment require hooks. One of the dependencies or',
  'require hooks didn\'t return anything that makes sense, so we don\'t know what to do.',
  '',
  'Sorry.',
].join('\n');

function shouldCompile(filename, exts, matcher, ignoreNodeModules) {
  var ret;
  debug('shouldCompile: ' +
        'filename:' + filename +
        ', exts: ' + exts +
        ', ignoreNodeModules: ' + ignoreNodeModules);
  if (typeof filename !== 'string') {
    debug('shouldCompile: false (filename wasn\'t a string)');
    return false;
  }
  if (exts.indexOf(path.extname(filename)) === -1) {
    debug('shouldCompile: false (wrong ext. ' +
          'actual: ' + path.extname(filename) +
          'expected: ' + exts.join(',') + ')');
    return false;
  }
  filename = path.resolve(filename);
  debug('shouldCompile: absolute path: ' + filename);
  if (ignoreNodeModules && nodeModulesRegex.test(filename)) {
    debug('shouldCompile: node modules');
    return false;
  }
  if (matcher && typeof matcher === 'function') {
    ret = !!matcher(filename);
    debug('shouldCompile: matcher returned: ' + ret);
    return ret;
  }
  debug('shouldCompile: ok, compilable');
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
  var matcher, exts, ignoreNodeModules, optsStr;

  // We need to do this to fix #15. Basically, if you use a non-standard extension (ie. .jsx), then
  // We modify the .js loader, then use the modified .js loader for as the base for .jsx.
  // This prevents that.
  var originalJSLoader = Module._extensions['.js'];

  opts = opts || {};
  matcher = opts.matcher || null;
  ignoreNodeModules = opts.ignoreNodeModules !== false;
  exts = opts.extensions || opts.exts || opts.extension || opts.ext || ['.js'];
  if (!Array.isArray(exts)) exts = [exts];

  optsStr = JSON.stringify(
    {
      opts: opts,
      matcher: matcher,
      ignoreNodeModules: ignoreNodeModules,
      exts: exts,
    },
    null, 2
  );

  debug('addHook: final options: ' + optsStr);

  exts.forEach(function registerExtension(ext) {
    var oldLoader;
    if (typeof ext !== 'string') throw new TypeError('[Pirates] Invalid Extension: ' + ext);
    oldLoader = Module._extensions[ext] || originalJSLoader;

    debug('registerExtension: ' + ext);

    Module._extensions[ext] = function newLoader(mod, filename) {
      var compile;
      if (!reverted) {
        compile = mod._compile;
        mod._compile = function fakeCompile(code /*, filename*/) {
          var newCode = code;

          if (shouldCompile(filename, exts, matcher, ignoreNodeModules)) {
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
