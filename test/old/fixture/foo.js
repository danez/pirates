/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */

console.log('foo');
@@macroA;

if (!injectedVar) {
  console.log('Bad: No injectedVar');
} else {
  console.log('injectedVar: OK');
}