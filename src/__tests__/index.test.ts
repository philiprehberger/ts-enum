import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const mod = await import('../../dist/index.js');

describe('ts-enum', () => {
  it('should export defineEnum', () => {
    assert.ok(mod.defineEnum);
  });
});
