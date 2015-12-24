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
See [`test/README.md`](test/README.md) for lots of good info on tests.