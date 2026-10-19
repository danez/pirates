/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import { makeNonPiratesHook, assertModule } from './helpers/utils';

const call = (f) => (typeof f === 'function' ? f() : undefined);
const hasRegisterHooks = typeof require('module').registerHooks === 'function';

test.beforeEach((t) => {
  t.context = require('../');
});

// With Module.registerHooks(), pirates runs in Node's synchronous load-hook chain.
// Checkout Node's chaining convention for more details:
// https://nodejs.org/api/module.html#convention-of-hooks-and-chaining
// The non-pirates hooks below use Module._extensions/_compile instead, so they are
// outside that chain. In this mixed setup, placeholders they introduce later
// (for example @@e) are not visible to pirates hooks that already ran.
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

  if (hasRegisterHooks) {
    assertModule(t, 'chain-foo.js', 'in chain-foo a! b! @@c d! @@e');
    assertModule(t, 'chain-bar.js', 'in chain-bar a! b! c! d! @@e');
  } else {
    assertModule(t, 'chain-foo.js', 'in chain-foo a! b! @@c d! e!');
    assertModule(t, 'chain-bar.js', 'in chain-bar a! b! c! d! e!');
  }

  reverts.map(call);
});
