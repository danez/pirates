/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
import test from 'ava';
import path from 'path';
import { fork } from 'child_process';

test(t => {
  let data = '';
  const child = fork(path.resolve(__dirname, 'fixture', 'main'), { silent: true });
  child.on('error', t.fail.bind(t));
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', chunk => console.error('Child Error:', chunk));
  child.stdout.on('data', chunk => data += chunk);
  child.stdout.on('end', () => {
    t.is(data.trim(), [
      'foo',
      'in macroA',
      'in macroB',
      'in macroC',
      'in macroD',
      'injectedVar: OK',
      'bar',
      'No injectedVar: OK',
    ].join('\n'));
    t.pass();
  });
});
