/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* global expect:false, assert:false */
/* eslint-env mocha */
const rewire = require('rewire');

describe('somethingElse', () => {
  let somethingElse;
  beforeEach(() => {
    somethingElse = rewire('./somethingElse');
  });

  it('should do something', () => {
    expect(somethingElse).to.not.throw();
  });
});
