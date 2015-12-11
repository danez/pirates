/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { addHook } from '..';
import { makeTest, makeNonPiratesHook } from './_utils';

test('non-pirates hooks', makeTest(
  {
    // This weirdness is to test that the rest of the chain still happens when a matcher is used.
    foo: 'module.exports = "in foo @@a @@c @@d"',
    bar: 'module.exports = "in bar @@a @@c @@d"',
  },
  () => {
    const reverts = [];

    reverts.push(addHook(code => code.replace('@@a', 'foo @@b')));
    makeNonPiratesHook('@@b', 'bar');
    reverts.push(addHook(code => code.replace('@@c', 'baz'), {
      matcher: filename => filename.indexOf('foo') === -1,
    }));
    makeNonPiratesHook('@@d', 'qux @@e');
    reverts.push(addHook(code => code.replace('@@e', 'quux')));

    return reverts;
  },
  {
    foo: 'in foo foo bar @@c qux quux',
    bar: 'in bar foo bar baz qux quux',
  }
));
