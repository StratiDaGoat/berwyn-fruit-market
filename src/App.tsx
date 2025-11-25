import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import FlashSalePopup from './components/FlashSalePopup';

// Lazy load pages
const Home = React.lazy(() =>
  import('./pages/Home').then(module => ({ default: module.Home }))
);
const About = React.lazy(() =>
  import('./pages/About').then(module => ({ default: module.About }))
);
const Products = React.lazy(() =>
  import('./pages/Products').then(module => ({ default: module.Products }))
);
const WeeklyAds = React.lazy(() =>
  import('./pages/WeeklyAds').then(module => ({ default: module.WeeklyAds }))
);
const Contact = React.lazy(() =>
  import('./pages/Contact').then(module => ({ default: module.Contact }))
);

// Feature flag: Set to true to show flash sale banner, false to hide it
const IS_FLASH_SALE_ACTIVE = true;

/**
 * Main App component with routing configuration
 * Sets up the main layout with header, footer, and page routes
 */
function App() {
  return (
    <div className="app">
      {IS_FLASH_SALE_ACTIVE && <FlashSalePopup />}
      <Header />
      <main className="main-content">
        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
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
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
