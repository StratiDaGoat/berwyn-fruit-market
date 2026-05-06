/**
 * May 6 weekly ad goes live Tue May 5, 2026 at 22:00 America/Chicago.
 * Before April 29 go-live: April 22 ad. Until May 6 go-live: April 29 ad. At/after: May 6 ad.
 */

const CHICAGO = 'America/Chicago';

const APRIL_29_GO_LIVE = { y: 2026, m: 4, d: 28 } as const;
const MAY_6_GO_LIVE = { y: 2026, m: 5, d: 5 } as const;

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

const APRIL_29_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  APRIL_29_GO_LIVE.y,
  APRIL_29_GO_LIVE.m,
  APRIL_29_GO_LIVE.d,
  22,
  0
);

const MAY_6_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  MAY_6_GO_LIVE.y,
  MAY_6_GO_LIVE.m,
  MAY_6_GO_LIVE.d,
  22,
  0
);

export type WeeklyAdWeekKey = 422 | 429 | 506;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  if (Date.now() >= MAY_6_AD_GO_LIVE_MS) return 506;
  if (Date.now() >= APRIL_29_AD_GO_LIVE_MS) return 429;
  return 422;
}

export const WEEKLY_AD_ASSETS = {
  422: {
    pdf: '/weekly-ad-april22.pdf',
    images: [
      '/weekly-ad-april22-first-page.webp',
      '/weekly-ad-april22-second-page.webp',
    ],
  },
  429: {
    pdf: '/weekly-ad-april29.pdf',
    images: [
      '/weekly-ad-april29-first-page.webp',
      '/weekly-ad-april29-second-page.webp',
    ],
  },
  506: {
    pdf: '/weekly-ad-5:6.pdf',
    images: [
      '/weekly-ad-5:6-first-page.webp',
      '/weekly-ad-5:6-second-page.webp',
    ],
  },
} as const;
