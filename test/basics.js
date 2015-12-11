/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { makeTest } from './_utils';

test('When all the hooks use pirates', makeTest(
  [
    'module.exports = "in 1" @@a @@b',
    'module.exports = "in 2" @@a @@b',
  ],
  [
    [code => code.replace('@@a', `+ ' a value'`)],
    [code => code.replace('@@b', `+ ' b value'`)],
  ],
  [
    `in 1 a value b value`,
    `in 2 a value b value`,
  ]
));

test('matchers', makeTest(
  {
    foo: 'module.exports = "in foo @@a @@b"',
    bar: 'module.exports = "in bar @@a @@b"',
  },
  [
    [code => code.replace('@@a', 'foo'), { matcher: filename => filename.indexOf('foo') === -1 }],
    [code => code.replace('@@b', 'bar')],
  ],
  {
    foo: 'in foo @@a bar',
    bar: 'in bar foo bar',
  }
));
