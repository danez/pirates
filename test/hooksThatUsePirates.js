/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { doTest } from './_utils';

test('When all the hooks use pirates', t => {
  const aValue = Math.random();
  const bValue = Math.random();

  doTest(
    t,
    [
      'module.exports = "in 1" @@a @@b',
      'module.exports = "in 2" @@a @@b',
    ],
    [
      [code => code.replace('@@a', `+ ' ${aValue}'`)],
      [code => code.replace('@@b', `+ ' ${bValue}'`)],
    ],
    [
      `in 1 ${aValue} ${bValue}`,
      `in 2 ${aValue} ${bValue}`,
    ]
  );
});
