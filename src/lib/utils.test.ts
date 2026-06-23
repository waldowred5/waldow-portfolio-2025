import { describe, expect, it } from 'vitest';

import { cn, convertToHex } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('deduplicates conflicting tailwind classes', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar');
  });

  it('returns empty string for no args', () => {
    expect(cn()).toBe('');
  });
});

describe('convertToHex', () => {
  it('converts [0, 0, 0] to #000000', () => {
    expect(convertToHex([0, 0, 0])).toBe('#000000');
  });

  it('converts [1, 1, 1] to #ffffff', () => {
    expect(convertToHex([1, 1, 1])).toBe('#ffffff');
  });

  it('converts fractional values correctly', () => {
    expect(convertToHex([0, 165 / 255, 184 / 255])).toBe('#00a5b8');
  });

  it('pads single hex digits with leading zero', () => {
    expect(convertToHex([0, 1 / 255, 0])).toBe('#000100');
  });

  it('throws when array length is not 3', () => {
    expect(() => convertToHex([1, 0] as unknown as number[])).toThrow(
      'Color array must have exactly three elements.',
    );
    expect(() => convertToHex([1, 0, 0, 0] as unknown as number[])).toThrow(
      'Color array must have exactly three elements.',
    );
  });
});
