import { Range } from '@/types/bulletin';

const BN_TO_EN_MAP: Record<string, string> = {
  '০': '0',
  '১': '1',
  '২': '2',
  '৩': '3',
  '৪': '4',
  '৫': '5',
  '৬': '6',
  '৭': '7',
  '৮': '8',
  '৯': '9'
};

/**
 * Converts Bengali digits (০-৯) to English digits (0-9).
 * Also handles mixed Bengali and English digits (e.g. "২0২৬").
 */
export function normalizeDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = input.toString().trim();
  return str.replace(/[০-৯]/g, (char) => BN_TO_EN_MAP[char] ?? char);
}

/**
 * Converts an English or Bengali date string like "১১.১০.২০২৬" or "11.10.2026"
 * to ISO format "2026-10-11".
 */
export function normalizeDateToISO(dateStr: string): string {
  if (!dateStr) return '';
  const normalized = normalizeDigits(dateStr);
  const match = normalized.match(/(\d{1,2})[\.\-\/](\d{1,2})[\.\-\/](\d{4})/);
  if (!match) return '';
  const day = match[1].padStart(2, '0');
  const month = match[2].padStart(2, '0');
  const year = match[3];
  return `${year}-${month}-${day}`;
}

/**
 * Parses a string number (e.g. "০.০", "৩১.৫", "31.5") into a float.
 * Returns fallback (default 0) if unparseable.
 */
export function parseNormalizedNumber(input: string, fallback = 0): number {
  if (!input) return fallback;
  const normalized = normalizeDigits(input);
  const match = normalized.match(/[-+]?\d*\.?\d+/);
  if (!match) return fallback;
  const num = parseFloat(match[0]);
  return isNaN(num) ? fallback : num;
}

/**
 * Splits a range string like "৫০.০-৮৭.০" into { min, max }.
 * If only a single number is present (e.g. "৮৭.০"), returns { min: 87.0, max: 87.0 }.
 */
export function parseRange(input: string): Range {
  if (!input) return { min: 0, max: 0 };
  const normalized = normalizeDigits(input);
  // Match two numbers separated by hyphen or en-dash or to
  const parts = normalized.split(/[-–—]/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const min = parseNormalizedNumber(parts[0]);
    const max = parseNormalizedNumber(parts[1]);
    return {
      min: Math.min(min, max),
      max: Math.max(min, max)
    };
  } else if (parts.length === 1) {
    const val = parseNormalizedNumber(parts[0]);
    return { min: val, max: val };
  }
  return { min: 0, max: 0 };
}

/**
 * Parses wind speed which can be a single number (e.g. "৭.৯") or a range (e.g. "৩.০-১৫.৪").
 */
export function parseWindSpeed(input: string): number | Range {
  if (!input) return 0;
  const normalized = normalizeDigits(input);
  if (normalized.includes('-') || normalized.includes('–')) {
    return parseRange(normalized);
  }
  return parseNormalizedNumber(normalized);
}

/**
 * Parses cloud value. If it is a number (e.g. "০", "৬", "0-8"), returns number or range/number.
 * If it is descriptive Bengali text (e.g. "পরিষ্কার" / clear), returns the Bengali text.
 */
export function parseCloud(input: string): number | string {
  if (!input) return 0;
  const trimmed = input.trim();
  const normalized = normalizeDigits(trimmed);

  // If it's purely digits or decimal
  if (/^\d+(\.\d+)?$/.test(normalized)) {
    return parseFloat(normalized);
  }

  // If it contains "পরিষ্কার" or letters without numbers
  return trimmed;
}
