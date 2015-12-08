/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { relative, resolve } from 'path';
import mock from 'mock-fs';
import { addHook } from '..';

test('When all the hooks use pirates', t => {
  t.plan(2);

  const fooValue = Math.random();
  const barValue = Math.random();

  mock({
    [relative(process.cwd(), resolve(__dirname, 'fixture', 'foo.js'))]: 'module.exports = "in foo" @@foo @@bar',
    [relative(process.cwd(), resolve(__dirname, 'fixture', 'baz.js'))]: 'module.exports = "in baz" @@foo @@bar',
  });

  addHook(code => code.replace('@@foo', `+ '${fooValue}'`));
  addHook(code => code.replace('@@bar', `+ '${barValue}'`));

  const foo = require('./fixture/foo');
  const baz = require('./fixture/baz');
  t.is(foo, `in foo${fooValue}${barValue}`);
  t.is(baz, `in baz${fooValue}${barValue}`);
});
