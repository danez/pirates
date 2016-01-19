/* (c) 2016 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { makeTest } from './_utils';

test('exts', makeTest(
  {
    'foo.js': `
     // Cheap and dirty way to load .foo files as .js files.
     require.extensions[".foo"] = require.extensions[".js"];

     // no-pirates.foo is valid js, but exports the macro.
     module.exports = "@@a, " + require("./no-pirates.foo");`,
    'no-pirates.foo': `module.exports = '@@a';`,
  },
  [
    [code => code.replace('@@a', 'a!'), { exts: ['.js'] }],
  ],
  [
    'a!, @@a',
  ]
));
