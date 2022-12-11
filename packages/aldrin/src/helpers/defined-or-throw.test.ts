import { assert, describe, it } from 'vitest';
import { definedOrThrow } from './defined-or-throw';

describe('definedOrThrow helper', () => {
  it('should pass', () => {
    assert.doesNotThrow(() => definedOrThrow(0));
  });

  it('should throw when null', () => {
    assert.throw(() => definedOrThrow(null));
  });

  it('should throw when undefined', () => {
    assert.throw(() => definedOrThrow(null));
  });
});
