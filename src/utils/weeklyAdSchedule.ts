/**
 * Weekly ad goes live Tuesday 10:00 PM store time (America/Chicago).
 * Before that moment we show the previous week's ad.
 * After Tuesday 10pm we show the new ad and never switch back — no "revert" time.
 */

const STORE_TIMEZONE = 'America/Chicago';

function getChicagoDateParts(date: Date): { year: number; month: number; day: number; weekday: number; hour: number; minute: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIMEZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  const weekdayNames: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: parseInt(get('year'), 10),
    month: parseInt(get('month'), 10),
    day: parseInt(get('day'), 10),
    weekday: weekdayNames[get('weekday')] ?? 0,
    hour: parseInt(get('hour'), 10),
    minute: parseInt(get('minute'), 10),
  };
}

/** US Central DST: 2nd Sunday March - 1st Sunday November */
function isDSTInChicago(year: number, month: number, day: number): boolean {
  if (month < 3 || month > 11) return false;
  if (month > 3 && month < 11) return true;
  const secondSunday = (() => {
    let d = 1;
    let count = 0;
    for (; d <= 31; d++) {
      if (new Date(year, month - 1, d).getDay() === 0) count++;
      if (count === 2) return d;
    }
    return 14;
  })();
  const firstSundayNov = (() => {
    for (let d = 1; d <= 7; d++) {
      if (new Date(year, 10, d).getDay() === 0) return d;
    }
    return 1;
  })();
  if (month === 3) return day >= secondSunday;
  if (month === 11) return day < firstSundayNov;
  return true;
}

/** Build a Date for the given day at 22:00 in America/Chicago */
function tuesday10pmChicago(year: number, month: number, day: number): Date {
  const offset = isDSTInChicago(year, month, day) ? '-05:00' : '-06:00';
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return new Date(`${year}-${mm}-${dd}T22:00:00${offset}`);
}

/**
 * True if the new weekly ad is live: we're at or past Tuesday 10pm in Chicago.
 * New ad runs from Tue 10pm through the following Tue 9:59pm. There is no
 * "change back" time — we only switch once at Tuesday 10pm.
 */
export function isNewWeeklyAdLive(): boolean {
  const now = new Date();
  const { year, month, day, weekday, hour } = getChicagoDateParts(now);
  // Tuesday before 10pm: haven't hit the switch yet, show previous (week 8)
  if (weekday === 2 && hour < 22) return false;
  // At or past the most recent Tuesday 10pm → show new ad (week 9). Never revert.
  const daysBack = weekday === 2 ? 0 : (weekday - 2 + 7) % 7;
  const tueDate = new Date(year, month - 1, day - daysBack);
  const tueYear = tueDate.getFullYear();
  const tueMonth = tueDate.getMonth() + 1;
  const tueDayNum = tueDate.getDate();
  const cutoff = tuesday10pmChicago(tueYear, tueMonth, tueDayNum);
  return now.getTime() >= cutoff.getTime();
}

/** Current ad is week 8 (previous) until Tue 10pm Chicago, then week 9 */
export function getCurrentWeeklyAdWeek(): 8 | 9 {
  return isNewWeeklyAdLive() ? 9 : 8;
}

export const WEEKLY_AD_ASSETS = {
  8: {
    pdf: '/weekly-ad-week-8.pdf',
    images: ['/weekly-ad-week-8-1.webp', '/weekly-ad-week-8-2.webp'],
  },
  9: {
    pdf: '/weekly-ad-week-9.pdf',
    images: ['/weekly-ad-week-9-1.webp', '/weekly-ad-week-9-2.webp'],
  },
} as const;
