import React, { useState, useEffect, useCallback } from 'react';
import { BANANA_EVENT_END_MS } from '../utils/bananaFlashSaleTimes';
import './FlashSalePopup.scss';
import './BananaFlashSalePopup.scss';

interface BananaFlashSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

/** ≥24h left: e.g. 2D:14H:43M. Under 24h: e.g. 23:42:32 */
function formatBananaCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return '00:00:00';
  const totalSec = Math.floor(msRemaining / 1000);
  const daySec = 24 * 3600;
  if (totalSec >= daySec) {
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    return `${days}D:${String(hours).padStart(2, '0')}H:${String(minutes).padStart(2, '0')}M`;
  }
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const BananaFlashSalePopup: React.FC<BananaFlashSalePopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayNow, setDisplayNow] = useState(() => Date.now());

  const now = displayNow;
  const ended = now >= BANANA_EVENT_END_MS;
  const remaining = Math.max(0, BANANA_EVENT_END_MS - now);
  const timeStr = formatBananaCountdown(remaining);
  const label = 'Ends in';

  const syncExpired = useCallback(() => {
    if (Date.now() >= BANANA_EVENT_END_MS) {
      setIsModalOpen(false);
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    syncExpired();
    const id = setInterval(() => {
      setDisplayNow(Date.now());
      syncExpired();
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, syncExpired]);

  if (!isOpen || ended) return null;

  return (
    <>
      <div className="flash-sale-banner visible banana-flash-sale-banner">
        <div className="banner-container">
          <div className="banner-slider">
            <div className="banner-content">
              <span className="banner-text banana-banner-text">
                <span className="banana-banner-headline">
                  <span className="text-desktop">
                    1 FREE BUNCH OF BANANAS — WHILE SUPPLIES LAST
                  </span>
                  <span className="text-mobile">FREE BANANA BUNCH · WHILE SUPPLIES LAST</span>
                </span>
                <span className="banner-timer banana-banner-timer">
                  <span className="banner-countdown-label">{label}</span>
                  <span className="banner-countdown-time">{timeStr}</span>
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
            <div className="banana-popup-timer">
              <div>{label}</div>
              <div style={{ fontFamily: 'ui-monospace, monospace' }}>
                {timeStr}
              </div>
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
              src="/new-banana-ad.webp"
              alt="Free bunch of bananas — while supplies last"
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

export default BananaFlashSalePopup;
