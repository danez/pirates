# Writing a test
---

All our tests are written using [AVA](http://ava.il).

Because I am a [lazy programmer](http://threevirtues.com/), I wrote some helpers for writing tests (you can see them 
in [`./_utils.js`](_utils.js). I need to document all of them better, but the one you really care about is 
`utils.doTest`.
It basically abstracts away all of the boilerplate of writing a test, to make tests super easy and expressive. Here's 
an example:
```javascript
import test from 'ava';
import { doTest } from './_utils';

test('something', t => {
  doTest(
    t,
    {
      // These are mappings of filenames to content. The filenames a relative to test/fixture, and will get '.js' added 
      // to the end. Since it is only possible to mock files that exist, it is recommended that you only use the 
      // names of files in test/fixture, which are currently `foo`, `bar`, `baz`, and `qux`.
      foo: 'module.exports = @@a require('./bar');'
      bar: 'module.exports = 5 @@b',
    },
    [
      // This is an array of arrays of arguments. pirates.addHook will be invoked with each array as its argument.
      // For example, for the following:
      code => code.replace('@@a', '\'aa\' + '),
      [code => code.replace('@@b', '* 2'), { matcher: path => path.indexOf('bar') !== -1 }],
      // Will be converted to:
      // pirates.addHook(code => code.replace('@@a', '\'aa\' + '));
      // pirates.addHook(code => code.replace('@@b', '* 2'), { matcher: path => path.indexOf('bar') !== -1 });
    ],
    {
      // These are mappings of filenames to their expected *export*. Each file will be required and the export 
      // compared with `t.same` (deep equality). The keys should be the same as above.
      foo: '10aa',
      bar: 10,
    }
  );
});
```
This will handle clearing the require cache, mocking the file system, registering hooks, requiring the files, and 
restoring the filesystem and hooks. Optionally, any one of the arguments can instead be a function, which accepts no 
arguments and should return an array of `revert` functions. Each function will be called once with no arguments after 
the test is over.

For extreme laziness purposes, you can also do the following (it's a thin wrapper around `doTest`):
```javascript
import test from 'ava';
import { makeTest } from './_utils';

test('something', makeTest( // This returns a function, which accepts `t`, then invokes `doTest`.
  {
    // These are mappings of filenames to content. The filenames a relative to test/fixture, and will get '.js' added 
    // to the end. Since it is only possible to mock files that exist, it is recommended that you only use the 
    // names of files in test/fixture, which are currently `foo`, `bar`, `baz`, and `qux`.
    foo: 'module.exports = @@a require(\'./bar\');'
    bar: 'module.exports = 5 @@b',
  },
  [
    // This is an array of arrays of arguments. pirates.addHook will be invoked with each array as its argument.
    // For example, for the following:
    code => code.replace('@@a', '\'aa\' + '),
    [code => code.replace('@@b', '* 2'), { matcher: path => path.indexOf('bar') !== -1 }],
    // Will be converted to:
    // pirates.addHook(code => code.replace('@@a', '\'aa\' + '));
    // pirates.addHook(code => code.replace('@@b', '* 2'), { matcher: path => path.indexOf('bar') !== -1 });
  ],
  {
    // These are mappings of filenames to their expected *export*. Each file will be required and the export 
    // compared with `t.same` (deep equality). The keys should be the same as above.
    foo: '10aa',
    bar: 10,
  }
));
```

Currently, there is no code coverage, as all CC tools use a require hook, which would mess with the tests. However, 
we could certainly use more tests, so please contribute some.
