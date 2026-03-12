/**
 * Weekly ad: always show the current week (week 11) with no delayed switch.
 * We keep the helper shape the same so components don't need to change.
 */

export function getCurrentWeeklyAdWeek(): 11 {
  return 11;
}

export const WEEKLY_AD_ASSETS = {
  11: {
    pdf: '/weekly-ad-3_11.pdf',
    images: ['/weekly-ad-3:11-first-page.webp', '/weekly-ad-3:11-second-page.webp'],
  },
} as const;
