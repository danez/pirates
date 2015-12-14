/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* eslint no-var:0, prefer-const: 0, vars-on-top: 0 */
// This is not ES6, AVA doesn't transpile it.
var path = require('path');
var mock = require('mock-fs');

var availFilenames = ['foo', 'bar', 'baz', 'qux'];

function fileToMockedFile(filename, relative) {
  filename = filename + '.js';
  filename = path.resolve(__dirname, 'fixture', filename);
  if (relative !== false) filename = path.relative(process.cwd(), filename);
  return filename;
}

function mockFiles(files) {
  if (Array.isArray(files)) {
    var fileNames = availFilenames.slice();
    files = files.reduce(function assignName(newFiles, value) {
      newFiles[fileNames.shift()] = value;
      return newFiles;
    }, {});
  }
  var mocks = {};
  Object.keys(files).forEach(function processFilename(filename) {
    var content = files[filename];
    mocks[fileToMockedFile(filename, true)] = content;
  });
  return mock(mocks);
}

function assertModule(t, _filename, expected) {
  var filename = fileToMockedFile(_filename);
  // The path nonsense is to make it an absolute paths
  delete require.cache[path.resolve(process.cwd(), filename)];
  return t.same(require('./fixture/' + _filename + '.js'), expected);
}

function makeNonPiratesHook(macro, value) {
  var oldLoader = require.extensions['.js'];
  require.extensions['.js'] = function loader(mod, filename) {
    var _compile = mod._compile;
    mod._compile = function newCompile(code) {
      if (path.resolve(filename, '..') === __dirname) return _compile.call(mod, code, filename);
      return _compile.call(mod, code.replace(macro, value), filename);
    };
    oldLoader(mod, filename);
  };
}

/**
 * This basically abstracts away all the test boilerplate
 * @param t - The test object AVA provides
 * @param files {String[]|Object} - Either an object of filename/content mappings, or a list of file contents, which
 *                                  will be assigned names. Names example: 'foo' => 'fixture/foo.js'.
 *                                  `module.exports =` will be prepended if needed.
 * @param hooks {Array[]} - An array of list of arguments for pirates.addHook
 * @param expectations - Same as files, but instead of content, expected exports.
 */
function doTest(t, files, hooks, expectations) {
  delete require.cache[path.resolve(__dirname, '..', 'lib', 'index.js')];
  availFilenames.forEach(function clearCache(filename) {
    delete require.cache[fileToMockedFile(filename, false)];
  });

  var pirates = require('..');

  var reverts = [mock.restore.bind(mock)];

  if (typeof files === 'function') reverts = reverts.concat(files());
  else mockFiles(files);

  if (typeof hooks === 'function') {
    reverts = reverts.concat(hooks());
  } else {
    hooks.forEach(function registerHook(args) {
      reverts.push(pirates.addHook.apply(pirates, args));
    });
  }

  if (typeof expectations === 'function') {
    reverts = reverts.concat(expectations()); // This can return reverts not because it should, but for consistency.
  } else {
    if (Array.isArray(expectations)) {
      var filenames = availFilenames.slice();
      expectations = expectations.reduce(function assignFilename(newExpectations, expectation) {
        // FIXME: this should really be linked better with the array processing above.
        newExpectations[filenames.shift()] = expectation;
        return newExpectations;
      }, {});
    }
    Object.keys(expectations).forEach(function assertExpectation(filename) {
      assertModule(t, filename, expectations[filename]);
    });
  }

  reverts.forEach(function doRevert(revert) {
    revert();
  });
}

function makeTest(files, hooks, expectations) { // eslint-disable-line no-unused-vars
  var args = Array.prototype.slice.apply(arguments);
  return function callDoTest(t) {
    return doTest.apply(this, [t].concat(args));
  };
}

module.exports = {
  mockFiles: mockFiles,
  assertModule: assertModule,
  doTest: doTest,
  makeTest: makeTest,
  makeNonPiratesHook: makeNonPiratesHook,
};
