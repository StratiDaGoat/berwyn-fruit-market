import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls window to the top whenever the route pathname changes
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use smooth behavior for nicer UX; falls back gracefully
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
