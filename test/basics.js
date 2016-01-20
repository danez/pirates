/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import rewire from 'rewire';
import { assertModule } from './_utils';

const call = f => f();

test.beforeEach(t => {
  t.context = rewire('../');
});

test('basics', t => {
  const reverts = [
    t.context.addHook(code => code.replace('@@a', '\<a\>')),
    t.context.addHook(code => code.replace('@@b', '\<b\>')),
  ];

  assertModule(t, 'basics-foo.js', 'in basics-foo \<a\> \<b\>');
  assertModule(t, 'basics-bar.js', 'in basics-bar \<a\> \<b\>');

  reverts.forEach(call);
});

test('matchers', t => {
  const reverts = [
    t.context.addHook(code => code.replace('@@a', '\<a\>'), {
      matcher: filename => filename.indexOf('foo') === -1,
    }),
    t.context.addHook(code => code.replace('@@b', '\<b\>')),
  ];

  assertModule(t, 'basics-foo.js', 'in basics-foo @@a \<b\>');
  assertModule(t, 'basics-bar.js', 'in basics-bar \<a\> \<b\>');

  reverts.forEach(call);
});
