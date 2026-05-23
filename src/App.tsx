import { Suspense, useLayoutEffect, useState, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import ChipsAhoyBanner from './components/ChipsAhoyBanner';
import {
  IS_BANANA_FLASH_ACTIVE,
  IS_CHIPS_AHOY_ACTIVE,
  IS_FLASH_SALE_ACTIVE,
} from './config/siteFlags';
import { syncPromoBannerLayout } from './utils/promoBannerLayout';
import { isBananaFlashSaleInWindow } from './utils/bananaFlashSaleTimes';

const FlashSalePopup = lazy(() => import('./components/FlashSalePopup'));
const BananaFlashSalePopup = lazy(
  () => import('./components/BananaFlashSalePopup')
);

const About = lazy(() =>
  import('./pages/About').then(module => ({ default: module.About }))
);
const Products = lazy(() =>
  import('./pages/Products').then(module => ({ default: module.Products }))
);
const WeeklyAds = lazy(() =>
  import('./pages/WeeklyAds').then(module => ({ default: module.WeeklyAds }))
);
const Contact = lazy(() =>
  import('./pages/Contact').then(module => ({ default: module.Contact }))
);

const Analytics = lazy(() =>
  import('@vercel/analytics/react').then(module => ({
    default: module.Analytics,
  }))
);
const SpeedInsights = lazy(() =>
  import('@vercel/speed-insights/react').then(module => ({
    default: module.SpeedInsights,
  }))
);

function App() {
  const [isBannerVisible, setIsBannerVisible] = useState(() => {
    if (!IS_FLASH_SALE_ACTIVE) return false;
    const targetDate = new Date('2026-02-08T21:00:00-06:00');
    return targetDate.getTime() > Date.now();
  });

  const [isBananaBannerVisible, setIsBananaBannerVisible] = useState(
    () => IS_BANANA_FLASH_ACTIVE && isBananaFlashSaleInWindow()
  );

  const [isChipsAhoyVisible, setIsChipsAhoyVisible] = useState(
    IS_CHIPS_AHOY_ACTIVE
  );

  const promoBannerOpen =
    (IS_FLASH_SALE_ACTIVE && isBannerVisible) ||
    (IS_BANANA_FLASH_ACTIVE && isBananaBannerVisible) ||
    (IS_CHIPS_AHOY_ACTIVE && isChipsAhoyVisible);

  useLayoutEffect(() => {
    syncPromoBannerLayout(promoBannerOpen);
  }, [promoBannerOpen]);

  return (
    <div className="app">
      {IS_FLASH_SALE_ACTIVE && isBannerVisible && (
        <Suspense fallback={null}>
          <FlashSalePopup
            isOpen={isBannerVisible}
            onClose={() => setIsBannerVisible(false)}
          />
        </Suspense>
      )}
      {IS_BANANA_FLASH_ACTIVE && isBananaBannerVisible && (
        <Suspense fallback={null}>
          <BananaFlashSalePopup
            isOpen={isBananaBannerVisible}
            onClose={() => setIsBananaBannerVisible(false)}
          />
        </Suspense>
      )}
      {IS_CHIPS_AHOY_ACTIVE && isChipsAhoyVisible && (
        <ChipsAhoyBanner
          isOpen={isChipsAhoyVisible}
          onClose={() => setIsChipsAhoyVisible(false)}
        />
      )}
      <Header />
      <main className="main-content">
        <Suspense
          fallback={<div className="route-loading-placeholder" aria-hidden />}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/departments" element={<Products />} />
            <Route path="/weekly-ad" element={<WeeklyAds />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </div>
  );
}

export default App;
