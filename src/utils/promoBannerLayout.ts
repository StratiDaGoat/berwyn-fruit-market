/** Syncs document layout vars so header/main never jump on hydration. */
export function syncPromoBannerLayout(isVisible: boolean): void {
  const root = document.documentElement;
  if (isVisible) {
    root.classList.add('has-promo-banner');
    root.classList.remove('promo-banner-dismissed');
  } else {
    root.classList.remove('has-promo-banner');
    root.classList.add('promo-banner-dismissed');
  }
}
