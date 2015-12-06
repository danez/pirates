/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */

console.log('bar');

if (typeof injectedVar === 'undefined') {
  console.log('No injectedVar: OK');
} else {
  console.log('Bad: injectedVar');
}
