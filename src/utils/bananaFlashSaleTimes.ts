/**
 * Banana flash sale — ends Apr 6, 2026 at 9:00 PM America/Chicago (Central Time).
 * Same clock for everyone; not tied to the visitor’s laptop timezone.
 */
export const BANANA_EVENT_END_MS = Date.parse('2026-04-06T21:00:00-05:00');

export function isBananaFlashSaleInWindow(now = Date.now()): boolean {
  return now < BANANA_EVENT_END_MS;
}
