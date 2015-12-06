# Contributing
ARRRRR, don't be a filthy landlubber, contribute to pirates!

## Filing Issues
ARRRRR, thanks for filing an issue matey. Make sure to include the version!

## Writing Code / Submitting PRs
ARRRRRRRR, thanks so much for contributing to pirates, matey. Here's what you need to know:
1. Pirates is in `lib/`, tests are in `test` (see below for more on the tests)
2. Test and lint your code with `npm test`.
  * We will not accept any code that does not have (and pass) tests for it, or fails linting (a few warnings are OK).
3. Only known-good code will be merged into master, because...
4. We use [`semantic-release`][], so whatever is in master is automatically published to npm.
5. To make semantic-release work, we use the [Angular commit message guidelines][]. Please make sure that all 
commits that you make follow them. 
  * To assist with this, we support [Commitizen][], which makes committing easy.
  * If you have a commit that doesn't comply with the guidelines, ~~walk the plank!~~ No Problem! `git commit --amend
   and `git rebase -i <last known good commit>` are your friends.

[Angular commit message guidelines]: https://github.com/ajoslin/conventional-changelog/blob/master/conventions/angular.md "Angular Commit Message Guidelines"
[`semantic-release`]: https://github.com/semantic-release/semantic-release "Semantic-Release"
[Commitizen]: https://github.com/commitizen/cz-cli "Commitizen"

## Tests
```
Pirates
  +-- lib/ - The actual code
    +-- index.js - Pirates 
  +-- test/
    +-- .eslintrc - Some test-specific eslint config
    +-- \_setup.js - Some test setup. Puts chai in a global, etc.
    +-- mocha.opts - Mocha config
    +-- test.js - The test!
    +-- fixture
      +-- main.js - Loads the compilers in compilers/, loads foo.js
      +-- foo.js - Contains macros to be parsed by the compilers
      +-- compilers/ - Some dummy require hooks that do string replacement on some macros
        +-- compilerA.js - Uses pirates. Replaces `@@macroA` with a log and a call to `@@macroB`
        +-- compilerB.js - Doesn't use pirates. Replaces `@@macroB` with a log and a call to `@@macroC`
        +-- compilerC.js - Doesn't use pirates. Replaces `@@macroC` with a log and a call to `@@macroD`
        +-- compilerD.js - Uses pirates. Replaces `@@macroD` with a log
                                
```

test.js simply forks a node process to run main.js, and compares the output with the expected result. It is 
(currently) the only test.