/**
 * June 3 weekly ad goes live Tue June 2, 2026 at 22:00 America/Chicago.
 * June 10 weekly ad goes live Tue June 9, 2026 at 22:00 America/Chicago.
 * June 17 weekly ad goes live Tue June 16, 2026 at 22:00 America/Chicago.
 * June 24 weekly ad goes live Tue June 23, 2026 at 22:00 America/Chicago.
 */

const CHICAGO = 'America/Chicago';

const APRIL_29_GO_LIVE = { y: 2026, m: 4, d: 28 } as const;
const MAY_6_GO_LIVE = { y: 2026, m: 5, d: 5 } as const;
const MAY_13_GO_LIVE = { y: 2026, m: 5, d: 12 } as const;
const MAY_20_GO_LIVE = { y: 2026, m: 5, d: 19 } as const;
const MAY_27_GO_LIVE = { y: 2026, m: 5, d: 26 } as const;
const JUNE_3_GO_LIVE = { y: 2026, m: 6, d: 2 } as const;
const JUNE_10_GO_LIVE = { y: 2026, m: 6, d: 9 } as const;
const JUNE_17_GO_LIVE = { y: 2026, m: 6, d: 16 } as const;
const JUNE_24_GO_LIVE = { y: 2026, m: 6, d: 23 } as const;

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

const MAY_13_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  MAY_13_GO_LIVE.y,
  MAY_13_GO_LIVE.m,
  MAY_13_GO_LIVE.d,
  22,
  0
);

const MAY_20_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  MAY_20_GO_LIVE.y,
  MAY_20_GO_LIVE.m,
  MAY_20_GO_LIVE.d,
  22,
  0
);

const MAY_27_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  MAY_27_GO_LIVE.y,
  MAY_27_GO_LIVE.m,
  MAY_27_GO_LIVE.d,
  22,
  0
);

const JUNE_3_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JUNE_3_GO_LIVE.y,
  JUNE_3_GO_LIVE.m,
  JUNE_3_GO_LIVE.d,
  22,
  0
);

const JUNE_10_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JUNE_10_GO_LIVE.y,
  JUNE_10_GO_LIVE.m,
  JUNE_10_GO_LIVE.d,
  22,
  0
);

const JUNE_17_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JUNE_17_GO_LIVE.y,
  JUNE_17_GO_LIVE.m,
  JUNE_17_GO_LIVE.d,
  22,
  0
);

const JUNE_24_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JUNE_24_GO_LIVE.y,
  JUNE_24_GO_LIVE.m,
  JUNE_24_GO_LIVE.d,
  22,
  0
);

export type WeeklyAdWeekKey = 422 | 429 | 506 | 513 | 520 | 527 | 603 | 610 | 617 | 624;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  if (Date.now() >= JUNE_24_AD_GO_LIVE_MS) return 624;
  if (Date.now() >= JUNE_17_AD_GO_LIVE_MS) return 617;
  if (Date.now() >= JUNE_10_AD_GO_LIVE_MS) return 610;
  if (Date.now() >= JUNE_3_AD_GO_LIVE_MS) return 603;
  if (Date.now() >= MAY_27_AD_GO_LIVE_MS) return 527;
  if (Date.now() >= MAY_20_AD_GO_LIVE_MS) return 520;
  if (Date.now() >= MAY_13_AD_GO_LIVE_MS) return 513;
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
  513: {
    pdf: '/weekly-ad-5:13.pdf',
    images: [
      '/weekly-ad-5:13-first-page.webp',
      '/weekly-ad-5:13-second-page.webp',
    ],
  },
  520: {
    pdf: '/weekly-ad-5:20.pdf',
    images: [
      '/weekly-ad-5:20-first-page.webp',
      '/weekly-ad-5:20-second-page.webp',
    ],
  },
  527: {
    pdf: '/weekly-ad-5:27.pdf',
    images: [
      '/weekly-ad-5:27-first-page.webp',
      '/weekly-ad-5:27-second-page.webp',
    ],
  },
  603: {
    pdf: '/weekly-ad-june-3.pdf',
    images: [
      '/weekly-ad-june-3-first-page.webp',
      '/weekly-ad-june-3-second-page.webp',
    ],
  },
  610: {
    pdf: '/weekly-ad-june10.pdf',
    images: [
      '/weekly-ad-june10-first-page.webp',
      '/weekly-ad-june10-second-page.webp',
    ],
  },
  617: {
    pdf: '/weekly-ad-june17.pdf',
    images: [
      '/weekly-ad-june17-first-page.webp',
      '/weekly-ad-june17-second-page.webp',
    ],
  },
  624: {
    pdf: '/weekly-ad-june24.pdf',
    images: [
      '/weekly-ad-june24-first-page.webp',
      '/weekly-ad-june24-second-page.webp',
    ],
  },
} as const;
