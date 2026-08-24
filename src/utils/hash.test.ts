import { describe, expect, it } from 'vitest';

import { generateHash } from './hash';

describe('generateHash (FNV-1a 32-bit)', () => {
  it('produces the known empty-string vector', () => {
    // FNV-1a("") = offset basis, unsigned
    expect(generateHash('')).toBe('811c9dc5');
  });

  it('is deterministic', () => {
    expect(generateHash('NutriLens')).toBe(generateHash('NutriLens'));
  });

  it('distinguishes different inputs', () => {
    expect(generateHash('milk 1l')).not.toBe(generateHash('milk 2l'));
  });

  it('is case-sensitive', () => {
    expect(generateHash('Metro')).not.toBe(generateHash('metro'));
  });

  it('returns unsigned lowercase hex within 32 bits', () => {
    const hash = generateHash('voila product name with accents éàü');

    expect(hash).toMatch(/^[0-9a-f]+$/);
    expect(parseInt(hash, 16)).toBeLessThanOrEqual(0xffffffff);
  });
});
