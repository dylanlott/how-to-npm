const sinon = require('sinon');
const expect = require('chai').expect;
const adder = require('..');

let sandbox;

beforeEach(function () {
	sandbox = sinon.sandbox.create();
});

afterEach(function () {
	sandbox.restore();
});

describe('#adder', function () {
  it('should add two numbers', function (done) {
    const added = adder(1, 2);
    expect(added).to.equal(3);
    expect(added).to.be.a('Number');
    done();
  });
});
