import { describe, it, expect } from 'vitest';
import {
  normalizeDigits,
  normalizeDateToISO,
  parseNormalizedNumber,
  parseRange,
  parseWindSpeed,
  parseCloud
} from '@/lib/bamis/normalize';

describe('normalize utility', () => {
  it('converts Bengali digits to English digits', () => {
    expect(normalizeDigits('০১২৩৪৫৬৭৮৯')).toBe('0123456789');
    expect(normalizeDigits('৭৬৭')).toBe('767');
  });

  it('handles mixed Bengali and English digits', () => {
    expect(normalizeDigits('২0২৬')).toBe('2026');
    expect(normalizeDigits('১2৩4')).toBe('1234');
  });

  it('converts Bengali date format (DD.MM.YYYY) to ISO (YYYY-MM-DD)', () => {
    expect(normalizeDateToISO('১১.১০.২০২৬')).toBe('2026-10-11');
    expect(normalizeDateToISO('০৭.১০.২০২৬')).toBe('2026-10-07');
    expect(normalizeDateToISO('15.10.2026')).toBe('2026-10-15');
    expect(normalizeDateToISO('১১.১০.২0২৬')).toBe('2026-10-11');
  });

  it('parses normalized numbers accurately', () => {
    expect(parseNormalizedNumber('০.০')).toBe(0);
    expect(parseNormalizedNumber('১৯.০')).toBe(19);
    expect(parseNormalizedNumber('৩২.৪')).toBe(32.4);
    expect(parseNormalizedNumber('২১.৬')).toBe(21.6);
  });

  it('splits humidity and value ranges into min and max', () => {
    expect(parseRange('৫০.০-৮৭.০')).toEqual({ min: 50, max: 87 });
    expect(parseRange('৬১.০-৯৪.০')).toEqual({ min: 61, max: 94 });
    expect(parseRange('৮৭.০')).toEqual({ min: 87, max: 87 });
  });

  it('parses wind speed as a number or range', () => {
    expect(parseWindSpeed('৭.৯')).toBe(7.9);
    expect(parseWindSpeed('১.৬')).toBe(1.6);
    expect(parseWindSpeed('৩.০-১৫.৪')).toEqual({ min: 3, max: 15.4 });
  });

  it('parses cloud as a number (octa) or Bengali description', () => {
    expect(parseCloud('০')).toBe(0);
    expect(parseCloud('৬')).toBe(6);
    expect(parseCloud('৪')).toBe(4);
    expect(parseCloud('পরিষ্কার')).toBe('পরিষ্কার');
  });
});
