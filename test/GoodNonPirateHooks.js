/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import rewire from 'rewire';
import { makeNonPiratesHook, assertModule } from './helpers/utils';

const call = (f) => (typeof f === 'function' ? f() : undefined);

test.beforeEach((t) => {
  t.context = rewire('../');
});

test('non-pirates hooks', (t) => {
  const reverts = [
    t.context.addHook((code) => code.replace('@@a', 'a! @@b')),
    makeNonPiratesHook('@@b', 'b!'),
    t.context.addHook((code) => code.replace('@@c', 'c!'), {
      matcher: (filename) => filename.indexOf('foo') === -1,
    }),
    makeNonPiratesHook('@@d', 'd! @@e'),
    t.context.addHook((code) => code.replace('@@e', 'e!')),
  ];

  assertModule(t, 'chain-foo.js', 'in chain-foo a! b! @@c d! e!');
  assertModule(t, 'chain-bar.js', 'in chain-bar a! b! c! d! e!');

  reverts.map(call);
});
