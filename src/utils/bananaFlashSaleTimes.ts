/**
 * Customer Appreciation -- 1 Bunch Free banana event.
 * Ends July 4, 2026 at 7:00 PM America/Chicago (CDT = UTC-5).
 * Same clock for everyone; not tied to the visitor's laptop timezone.
 */
export const BANANA_EVENT_END_MS = Date.parse('2026-07-04T19:00:00-05:00');

export function isBananaFlashSaleInWindow(now = Date.now()): boolean {
  return now < BANANA_EVENT_END_MS;
}
