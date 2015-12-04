/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var path = require('path');
var fork = require('child_process').fork;


describe('compilers that use the pirates API', function dCompilersThatUsethePiratesAPI() {
  it('they should work', function itTheyShouldWork(done) {
    var data = '';
    var child = fork(path.resolve(__dirname, 'fixture', 'main'), {
      silent: true,
    });
    child.on('error', done);
    child.stdout.on('data', function onData(chunk) {
      data += chunk;
    });
    child.stdout.on('end', function onEnd() {
      expect(data.trim()).to.equal([
        'foo',
        'in macroA',
        'in macroB',
      ].join('\n'));
      done();
    });
  });
});

