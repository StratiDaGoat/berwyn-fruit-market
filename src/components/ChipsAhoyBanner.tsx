import React, { useState } from 'react';
import './FlashSalePopup.scss';
import './ChipsAhoyBanner.scss';

interface ChipsAhoyBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChipsAhoyBanner: React.FC<ChipsAhoyBannerProps> = ({
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="flash-sale-banner visible chips-ahoy-banner">
        <div className="banner-container">
          <div className="banner-slider">
            <div className="banner-content">
              <span className="banner-text chips-ahoy-text">
                <span className="text-desktop">
                  SPECIAL! Chips Ahoy! Party Size — Only $3.99 · While Supplies Last
                </span>
                <span className="text-mobile">
                  Chips Ahoy! Party Size $3.99 · While Supplies Last
                </span>
              </span>
              <button
                type="button"
                className="view-btn"
                onClick={() => setIsModalOpen(true)}
              >
                VIEW
              </button>
            </div>
          </div>
          <button
            type="button"
            className="banner-close-btn"
            onClick={onClose}
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="chips-ahoy-popup" role="dialog" aria-modal="true">
          <div className="chips-ahoy-popup-header">
            <div style={{ width: 32 }} aria-hidden />
            <div className="chips-ahoy-popup-title">
              Chips Ahoy! Party Size — $3.99
            </div>
            <button
              type="button"
              className="chips-ahoy-popup-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close popup"
            >
              ×
            </button>
          </div>
          <div className="chips-ahoy-popup-image-wrap">
            <img
              src="/chipsahoyad.png"
              alt="Chips Ahoy Party Size $3.99 — While Supplies Last"
              loading="lazy"
              width="1200"
              height="1600"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChipsAhoyBanner;
