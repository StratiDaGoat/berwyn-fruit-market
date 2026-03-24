/**
 * March 24 weekly ad goes live at 10:00 PM America/Chicago on GO_LIVE (22:00 Central).
 * Before that: March 18 ad. At/after: March 24 ad (files named weekly-ad-march24-…).
 */

const CHICAGO = 'America/Chicago';

/** Calendar date in Chicago when the March 24 ad goes live at 22:00 */
const GO_LIVE = { y: 2026, m: 3, d: 24 } as const;

function chicagoParts(ms: number) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(ms);
}

function parseParts(parts: Intl.DateTimeFormatPart[]) {
  const g = (type: string) =>
    parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);
  return { y: g('year'), m: g('month'), d: g('day'), h: g('hour'), mi: g('minute') };
}

function utcMsAtChicagoWallClock(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): number {
  let t = Date.UTC(year, month - 1, day, 12, 0, 0);
  for (let i = 0; i < 120; i++) {
    const cur = parseParts(chicagoParts(t));
    if (
      cur.y === year &&
      cur.m === month &&
      cur.d === day &&
      cur.h === hour &&
      cur.mi === minute
    ) {
      return t;
    }
    const deltaMin = hour * 60 + minute - (cur.h * 60 + cur.mi);
    t += deltaMin * 60 * 1000;
    const wantDay = Date.UTC(year, month - 1, day);
    const gotDay = Date.UTC(cur.y, cur.m - 1, cur.d);
    t += wantDay - gotDay;
  }
  return t;
}

const MARCH_24_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  GO_LIVE.y,
  GO_LIVE.m,
  GO_LIVE.d,
  22,
  0
);

export type WeeklyAdWeekKey = 18 | 24;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  return Date.now() >= MARCH_24_AD_GO_LIVE_MS ? 24 : 18;
}

export const WEEKLY_AD_ASSETS = {
  18: {
    pdf: '/weekly-ad-march:18.pdf',
    images: [
      '/weekly-ad-march:18-first-page.webp',
      '/weekly-ad-march:18-second-page.webp',
    ],
  },
  24: {
    pdf: '/weekly-ad-march24.pdf',
    images: [
      '/weekly-ad-march24-first-page.webp',
      '/weekly-ad-march24-second-page.webp',
    ],
  },
} as const;
