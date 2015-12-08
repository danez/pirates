/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
var path = require('path');
var fork = require('child_process').fork;


it('should work', function itTheyShouldWork(done) {
  var data = '';
  var child = fork(path.resolve(__dirname, 'fixture', 'main'), {
    silent: true,
  });
  child.on('error', done);
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function onErrorData(chunk) {
    console.error('Child Error:', chunk);
  });
  child.stdout.on('data', function onData(chunk) {
    data += chunk;
  });
  child.stdout.on('end', function onEnd() {
    expect(data.trim()).to.equal([
      'foo',
      'in macroA',
      'in macroB',
      'in macroC',
      'in macroD',
      'injectedVar: OK',
      'bar',
      'No injectedVar: OK',
    ].join('\n'));
    done();
  });
});
