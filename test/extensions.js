/* (c) 2016 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import rewire from 'rewire';
import { assertModule } from './helpers/utils';

const call = (f) => f();

test.beforeEach((t) => {
  t.context = rewire('../');
});

test('exts', (t) => {
  const reverts = [t.context.addHook((code) => code.replace('@@a', 'a!'))];

  assertModule(t, 'extensions-main.js', 'a! @@a');

  reverts.forEach(call);
});

// a: @@a @@d => a! @@b d! e!
// b: @@a @@d => a! b! c! d! e!

// @@a: a! @@b
// @@b: b! @@c
// @@c: c!
// @@d: d! @@e
// @@e: e!

test('chain', (t) => {
  // Cheap and dirty way to load .foo files as .js files.
  require.extensions['.foojs'] = require.extensions['.js'];

  const reverts = [
    t.context.addHook((code) => code.replace('@@a', 'a! @@b'), {
      exts: ['.js', '.foojs'],
    }),
    t.context.addHook((code) => code.replace('@@b', 'b! @@c'), {
      exts: ['.foojs'],
    }),
    t.context.addHook((code) => code.replace('@@c', 'c!'), {
      exts: ['.js', '.foojs'],
    }),
    t.context.addHook((code) => code.replace('@@d', 'd! @@e'), {
      exts: ['.js', '.foojs'],
    }),
    t.context.addHook((code) => code.replace('@@e', 'e!'), {
      exts: ['.js', '.foojs'],
    }),
    () => delete require.extensions['.foojs'],
  ];

  assertModule(t, 'extensions-chain.js', 'a! @@b d! e!');
  assertModule(t, 'extensions-chain.foojs', 'a! b! c! d! e!');

  reverts.forEach(call);
});
