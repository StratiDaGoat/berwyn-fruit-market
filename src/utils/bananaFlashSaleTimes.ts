/**
 * Banana flash sale — times in America/Chicago (CDT late March: UTC-5).
 * Sat Mar 28, 2026: doors at 7:00 AM, offer ends 9:00 PM.
 */
export const BANANA_EVENT_START_MS = Date.parse('2026-03-28T07:00:00-05:00');
export const BANANA_EVENT_END_MS = Date.parse('2026-03-28T21:00:00-05:00');

export function isBananaFlashSaleInWindow(now = Date.now()): boolean {
  return now < BANANA_EVENT_END_MS;
}
