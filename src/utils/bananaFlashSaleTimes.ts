/**
 * Customer Appreciation -- 1 Bunch Free banana event.
 * Ends July 25, 2026 at 9:00 PM America/Chicago (CDT = UTC-5).
 */
export const BANANA_EVENT_END_MS = Date.parse('2026-07-25T21:00:00-05:00');

export function isBananaFlashSaleInWindow(now = Date.now()): boolean {
  return now < BANANA_EVENT_END_MS;
}
