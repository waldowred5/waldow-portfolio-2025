import { describe, expect, it } from 'vitest';

import { TAGLINES } from './heroTextTaglines';

describe('TAGLINES', () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  it('has exactly 26 entries, one for each letter of the alphabet', () => {
    expect(Object.keys(TAGLINES).length).toBe(26);
    letters.forEach((letter) => {
      expect(TAGLINES).toHaveProperty(letter);
    });
  });

  it('each entry has a non-empty verbs array', () => {
    letters.forEach((letter) => {
      expect(
        TAGLINES[letter as keyof typeof TAGLINES].verbs.length,
      ).toBeGreaterThan(0);
    });
  });

  it('each entry has a non-empty taglines array', () => {
    letters.forEach((letter) => {
      expect(
        TAGLINES[letter as keyof typeof TAGLINES].taglines.length,
      ).toBeGreaterThan(0);
    });
  });

  it('no verb is an empty string', () => {
    letters.forEach((letter) => {
      TAGLINES[letter as keyof typeof TAGLINES].verbs.forEach((v) => {
        expect(v.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('no tagline is an empty string', () => {
    letters.forEach((letter) => {
      TAGLINES[letter as keyof typeof TAGLINES].taglines.forEach((t) => {
        expect(t.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
