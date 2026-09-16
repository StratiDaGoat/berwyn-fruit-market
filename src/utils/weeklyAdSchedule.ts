/**
 * June 3 weekly ad goes live Tue June 2, 2026 at 22:00 America/Chicago.
 * June 10 weekly ad goes live Tue June 9, 2026 at 22:00 America/Chicago.
 * June 17 weekly ad goes live Tue June 16, 2026 at 22:00 America/Chicago.
 * June 24 weekly ad goes live Tue June 23, 2026 at 22:00 America/Chicago.
 * July 1 weekly ad goes live Tue June 30, 2026 at 22:00 America/Chicago.
 * July 8 weekly ad goes live Tue July 7, 2026 at 22:00 America/Chicago.
 * July 15 weekly ad goes live Tue July 14, 2026 at 22:00 America/Chicago.
 * July 22 weekly ad goes live Tue July 21, 2026 at 22:00 America/Chicago.
 * July 29 weekly ad goes live Tue July 28, 2026 at 22:00 America/Chicago.
 * Aug 5 weekly ad goes live Tue Aug 4, 2026 at 22:00 America/Chicago.
 * Aug 12 weekly ad goes live Tue Aug 11, 2026 at 22:00 America/Chicago.
 * Aug 19 weekly ad goes live Tue Aug 18, 2026 at 22:00 America/Chicago.
 * Aug 26 weekly ad goes live Tue Aug 25, 2026 at 22:00 America/Chicago.
 * Sept 2 weekly ad goes live Tue Sept 1, 2026 at 22:00 America/Chicago.
 * Sept 10 weekly ad goes live Tue Sept 8, 2026 at 22:00 America/Chicago.
 * Sept 16 weekly ad goes live Tue Sept 15, 2026 at 22:00 America/Chicago.
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
const JULY_1_GO_LIVE = { y: 2026, m: 6, d: 30 } as const;
const JULY_8_GO_LIVE = { y: 2026, m: 7, d: 7 } as const;
const JULY_15_GO_LIVE = { y: 2026, m: 7, d: 14 } as const;
const JULY_22_GO_LIVE = { y: 2026, m: 7, d: 21 } as const;
const JULY_29_GO_LIVE = { y: 2026, m: 7, d: 28 } as const;
const AUG_5_GO_LIVE = { y: 2026, m: 8, d: 4 } as const;
const AUG_12_GO_LIVE = { y: 2026, m: 8, d: 11 } as const;
const AUG_19_GO_LIVE = { y: 2026, m: 8, d: 18 } as const;
const AUG_26_GO_LIVE = { y: 2026, m: 8, d: 25 } as const;
const SEPT_2_GO_LIVE = { y: 2026, m: 9, d: 1 } as const;
const SEPT_10_GO_LIVE = { y: 2026, m: 9, d: 8 } as const;
const SEPT_16_GO_LIVE = { y: 2026, m: 9, d: 15 } as const;

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

const JULY_1_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JULY_1_GO_LIVE.y,
  JULY_1_GO_LIVE.m,
  JULY_1_GO_LIVE.d,
  22,
  0
);

const JULY_8_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JULY_8_GO_LIVE.y,
  JULY_8_GO_LIVE.m,
  JULY_8_GO_LIVE.d,
  22,
  0
);

const JULY_15_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JULY_15_GO_LIVE.y,
  JULY_15_GO_LIVE.m,
  JULY_15_GO_LIVE.d,
  22,
  0
);

const JULY_22_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JULY_22_GO_LIVE.y,
  JULY_22_GO_LIVE.m,
  JULY_22_GO_LIVE.d,
  22,
  0
);

const JULY_29_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  JULY_29_GO_LIVE.y,
  JULY_29_GO_LIVE.m,
  JULY_29_GO_LIVE.d,
  22,
  0
);

const AUG_5_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  AUG_5_GO_LIVE.y,
  AUG_5_GO_LIVE.m,
  AUG_5_GO_LIVE.d,
  22,
  0
);

const AUG_12_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  AUG_12_GO_LIVE.y,
  AUG_12_GO_LIVE.m,
  AUG_12_GO_LIVE.d,
  22,
  0
);

const AUG_19_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  AUG_19_GO_LIVE.y,
  AUG_19_GO_LIVE.m,
  AUG_19_GO_LIVE.d,
  22,
  0
);

const AUG_26_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  AUG_26_GO_LIVE.y,
  AUG_26_GO_LIVE.m,
  AUG_26_GO_LIVE.d,
  22,
  0
);

const SEPT_2_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  SEPT_2_GO_LIVE.y,
  SEPT_2_GO_LIVE.m,
  SEPT_2_GO_LIVE.d,
  22,
  0
);

const SEPT_10_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  SEPT_10_GO_LIVE.y,
  SEPT_10_GO_LIVE.m,
  SEPT_10_GO_LIVE.d,
  22,
  0
);

const SEPT_16_AD_GO_LIVE_MS = utcMsAtChicagoWallClock(
  SEPT_16_GO_LIVE.y,
  SEPT_16_GO_LIVE.m,
  SEPT_16_GO_LIVE.d,
  22,
  0
);

export type WeeklyAdWeekKey = 422 | 429 | 506 | 513 | 520 | 527 | 603 | 610 | 617 | 624 | 701 | 708 | 715 | 722 | 729 | 805 | 812 | 819 | 826 | 902 | 910 | 916;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  if (Date.now() >= SEPT_16_AD_GO_LIVE_MS) return 916;
  if (Date.now() >= SEPT_10_AD_GO_LIVE_MS) return 910;
  if (Date.now() >= SEPT_2_AD_GO_LIVE_MS) return 902;
  if (Date.now() >= AUG_26_AD_GO_LIVE_MS) return 826;
  if (Date.now() >= AUG_19_AD_GO_LIVE_MS) return 819;
  if (Date.now() >= AUG_12_AD_GO_LIVE_MS) return 812;
  if (Date.now() >= AUG_5_AD_GO_LIVE_MS) return 805;
  if (Date.now() >= JULY_29_AD_GO_LIVE_MS) return 729;
  if (Date.now() >= JULY_22_AD_GO_LIVE_MS) return 722;
  if (Date.now() >= JULY_15_AD_GO_LIVE_MS) return 715;
  if (Date.now() >= JULY_8_AD_GO_LIVE_MS) return 708;
  if (Date.now() >= JULY_1_AD_GO_LIVE_MS) return 701;
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
  701: {
    pdf: '/weekly-ad-july1.pdf',
    images: [
      '/weekly-ad-july1-first-page.webp',
      '/weekly-ad-july1-second-page.webp',
    ],
  },
  708: {
    pdf: '/weekly-ad-july8.pdf',
    images: [
      '/weekly-ad-july8-first-page.webp',
      '/weekly-ad-july8-second-page.webp',
    ],
  },
  715: {
    pdf: '/weekly-ad-july15.pdf',
    images: [
      '/weekly-ad-july15-first-page.webp',
      '/weekly-ad-july15-second-page.webp',
    ],
  },
  722: {
    pdf: '/weekly-ad-july22.pdf',
    images: [
      '/weekly-ad-july22-first-page.webp',
      '/weekly-ad-july22-second-page.webp',
    ],
  },
  729: {
    pdf: '/weekly-ad-july29.pdf',
    images: [
      '/weekly-ad-july29-second-page.webp',
      '/weekly-ad-july29-first-page.webp',
    ],
  },
  805: {
    pdf: '/weekly-ad-aug5.pdf',
    images: [
      '/weekly-ad-aug5-first-page.webp',
      '/weekly-ad-aug5-second-page.webp',
    ],
  },
  812: {
    pdf: '/weekly-ad-aug12.pdf',
    images: [
      '/weekly-ad-aug12-first-page.webp',
      '/weekly-ad-aug12-second-page.webp',
    ],
  },
  819: {
    pdf: '/weekly-ad-aug19.pdf',
    images: [
      '/weekly-ad-aug19-first-page.webp',
      '/weekly-ad-aug19-second-page.webp',
    ],
  },
  826: {
    pdf: '/weekly-ad-aug26.pdf',
    images: [
      '/weekly-ad-aug26-first-page.webp',
      '/weekly-ad-aug26-second-page.webp',
    ],
  },
  902: {
    pdf: '/weekly-ad-sep2.pdf',
    images: [
      '/weekly-ad-sep2-first-page.webp',
      '/weekly-ad-sep2-second-page.webp',
    ],
  },
  910: {
    pdf: '/weekly-ad-sep10.pdf',
    images: [
      '/weekly-ad-sep10-first-page.webp',
      '/weekly-ad-sep10-second-page.webp',
    ],
  },
  916: {
    pdf: '/weekly-ad-sep16.pdf',
    images: [
      '/weekly-ad-sep16-first-page.webp',
      '/weekly-ad-sep16-second-page.webp',
    ],
  },
} as const;
