import React, { useState, useEffect, useCallback } from 'react';
import { BANANA_EVENT_END_MS } from '../utils/bananaFlashSaleTimes';
import './FlashSalePopup.scss';
import './BananaFlashSalePopup.scss';

interface BananaFlashSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BananaFlashSalePopup: React.FC<BananaFlashSalePopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const syncExpired = useCallback(() => {
    if (Date.now() >= BANANA_EVENT_END_MS) {
      setIsModalOpen(false);
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    syncExpired();
    const id = setInterval(syncExpired, 60_000);
    return () => clearInterval(id);
  }, [isOpen, syncExpired]);

  if (!isOpen || Date.now() >= BANANA_EVENT_END_MS) return null;

  return (
    <>
      <div className="flash-sale-banner visible banana-flash-sale-banner">
        <div className="banner-container">
          <div className="banner-slider">
            <div className="banner-content">
              <span className="banner-text banana-banner-text">
                <span className="banana-banner-headline">
                  <span className="text-desktop">
                    1 BUNCH FREE · JULY 25TH · WHILE SUPPLIES LAST
                  </span>
                  <span className="text-mobile">1 BUNCH FREE · JULY 25TH</span>
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
        <div className="banana-flash-sale-popup" role="dialog" aria-modal="true">
          <div className="banana-popup-header">
            <div style={{ width: 32 }} aria-hidden />
            <div className="banana-popup-title">
              1 BUNCH FREE · JULY 25TH · WHILE SUPPLIES LAST
            </div>
            <button
              type="button"
              className="banana-popup-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close popup"
            >
              ×
            </button>
          </div>
          <div className="banana-popup-image-wrap">
            <img
              src="/banana-july25-free.webp"
              alt="1 Bunch Free — July 25th, while supplies last"
              loading="eager"
              width="1080"
              height="1350"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default BananaFlashSalePopup;
