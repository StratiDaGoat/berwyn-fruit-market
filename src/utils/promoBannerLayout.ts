import { IS_CHIPS_AHOY_ACTIVE } from '../config/siteFlags';

/** Syncs document layout vars so header/main never jump on hydration. */
export function syncPromoBannerLayout(isVisible: boolean): void {
  const root = document.documentElement;
  if (IS_CHIPS_AHOY_ACTIVE && isVisible) {
    root.classList.add('has-promo-banner');
    root.classList.remove('promo-banner-dismissed');
  } else {
    root.classList.remove('has-promo-banner');
    if (!isVisible) {
      root.classList.add('promo-banner-dismissed');
    }
  }
}
