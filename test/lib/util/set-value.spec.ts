import 'mocha';

import { expect } from 'chai';

import { setValue } from '../../../src/lib';

// tslint:disable:no-unused-expression

describe('setValue function', function() {
  const TEST_GOOD_STRING_VALUE = "I'm the test value.";
  const TEST_GOOD_NUMBER_VALUE = 6522345;
  const TEST_GOOD_NON_STRING_VALUE = true;
  const TEST_UNUSABLE_VALUE = undefined;
  // tslint:disable-next-line:no-null-keyword
  const TEST_NULL_VALUE = null;
  const TEST_DEFAULT_VALUE = "I'm the default value";

  it('should get the value we provide it', function() {
    const newValue = setValue(TEST_GOOD_STRING_VALUE);
    expect(newValue).to.be.equal(TEST_GOOD_STRING_VALUE);
  });

  it('should be the default value we provide it', function() {
    const newValue = setValue(TEST_UNUSABLE_VALUE, TEST_DEFAULT_VALUE);
    expect(newValue).to.be.equal(TEST_DEFAULT_VALUE);
  });

  it('should always return an undefined value, not null', function() {
    let newValue = setValue(TEST_UNUSABLE_VALUE);
    expect(newValue).to.be.undefined;

    newValue = setValue(TEST_NULL_VALUE);
    expect(newValue).to.be.undefined;
  });

  it('should return a number when one is given', function() {
    const newValue = setValue(TEST_GOOD_NUMBER_VALUE);
    expect(newValue).to.be.equal(TEST_GOOD_NUMBER_VALUE);
  });

  it('should convert a non-string or non-number value into a string', function() {
    const newValue = setValue(TEST_GOOD_NON_STRING_VALUE);
    expect(newValue).to.be.equal(String(TEST_GOOD_NON_STRING_VALUE));
  });
});
