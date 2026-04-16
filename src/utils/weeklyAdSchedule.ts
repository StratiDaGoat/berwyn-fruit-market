/**
 * April 16 weekly ad goes live Tue Apr 14, 2026 at 22:00 America/Chicago.
 * Before that: April 8 ad. At/after: April 16 ad.
 */

const CHICAGO = 'America/Chicago';

const GO_LIVE = { y: 2026, m: 4, d: 14 } as const;

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

const APRIL_16_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  GO_LIVE.y,
  GO_LIVE.m,
  GO_LIVE.d,
  22,
  0
);

export type WeeklyAdWeekKey = 408 | 416;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  return Date.now() >= APRIL_16_AD_GO_LIVE_MS ? 416 : 408;
}

export const WEEKLY_AD_ASSETS = {
  408: {
    pdf: '/weekly-ad-april8.pdf',
    images: [
      '/weekly-ad-april8-first-page.webp',
      '/weekly-ad-april8-second-page.webp',
    ],
  },
  416: {
    pdf: '/weekly-ad-april16.pdf',
    images: [
      '/weekly-ad-april16-first-page.webp',
      '/weekly-ad-april16-second-page.webp',
    ],
  },
} as const;
