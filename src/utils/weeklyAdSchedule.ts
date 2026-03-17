/**
 * March 18 weekly ad goes live Tuesday March 17, 2026 at 22:00 (10 PM) Central.
 * Before that: 3/11 ad. After: March 18 ad (WebP + PDF).
 */

/** Tue Mar 17 2026 22:00 America/Chicago (CDT, UTC-5) */
const MARCH_18_AD_GO_LIVE_MS = Date.parse('2026-03-17T22:00:00-05:00');

export type WeeklyAdWeekKey = 11 | 18;

export function getCurrentWeeklyAdWeek(): WeeklyAdWeekKey {
  return Date.now() >= MARCH_18_AD_GO_LIVE_MS ? 18 : 11;
}

export const WEEKLY_AD_ASSETS = {
  11: {
    pdf: '/weekly-ad-3_11.pdf',
    images: ['/weekly-ad-3:11-first-page.webp', '/weekly-ad-3:11-second-page.webp'],
  },
  18: {
    pdf: '/weekly-ad-march:18.pdf',
    images: [
      '/weekly-ad-march:18-first-page.webp',
      '/weekly-ad-march:18-second-page.webp',
    ],
  },
} as const;
