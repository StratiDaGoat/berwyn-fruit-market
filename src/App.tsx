import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { WeeklyAds } from './pages/WeeklyAds';
import { Contact } from './pages/Contact';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import FlashSalePopup from './components/FlashSalePopup';

// Feature flag: Set to true to show flash sale banner, false to hide it
const IS_FLASH_SALE_ACTIVE = false;

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<Products />} />
          <Route path="/weekly-ad" element={<WeeklyAds />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

export default App;
