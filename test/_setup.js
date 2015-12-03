/* (c) 2015 Ari Porad (@ariporad) <http://ariporad.com>. License: ariporad.mit-license.org */
/* global expect:false, assert:false */
/* eslint-env mocha */
var chai = require('chai');

chai.use(require('chai-as-promised'));

chai.should();
global.expect = chai.expect;
global.assert = chai.assert;