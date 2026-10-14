const BN_MONTHS = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর'
];

const BN_WEEKDAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts English number/digits to Bengali digits string.
 */
export function toBengaliNumber(val: number | string | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = val.toString();
  return str.replace(/[0-9]/g, (d) => BN_DIGITS[parseInt(d, 10)] ?? d);
}

/**
 * Formats ISO date "2026-10-11" to Bengali representation "১১ অক্টোবর ২০২৬".
 */
export function formatBengaliDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map((n) => parseInt(n, 10));
  if (!year || !month || !day) return isoDate;

  const bnDay = toBengaliNumber(day);
  const bnMonth = BN_MONTHS[month - 1] ?? '';
  const bnYear = toBengaliNumber(year);

  return `${bnDay} ${bnMonth} ${bnYear}`;
}

/**
 * Formats ISO date "2026-10-11" with day of the week, e.g. "রবিবার, ১১ অক্টো".
 */
export function formatBengaliWeekdayDate(isoDate: string): {
  weekday: string;
  formattedDate: string;
  shortDate: string;
} {
  if (!isoDate) {
    return { weekday: '', formattedDate: '', shortDate: '' };
  }
  const dateObj = new Date(isoDate + 'T00:00:00');
  const dayOfWeek = dateObj.getDay();
  const weekday = BN_WEEKDAYS[dayOfWeek] ?? '';

  const [, month, day] = isoDate.split('-').map((n) => parseInt(n, 10));
  const bnDay = toBengaliNumber(day);
  const bnMonth = BN_MONTHS[(month || 1) - 1] ?? '';

  return {
    weekday,
    formattedDate: `${weekday}, ${bnDay} ${bnMonth}`,
    shortDate: `${bnDay} ${bnMonth}`
  };
}
