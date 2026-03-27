import React, { useState, useEffect, useCallback } from 'react';
import {
  BANANA_EVENT_START_MS,
  BANANA_EVENT_END_MS,
} from '../utils/bananaFlashSaleTimes';
import './FlashSalePopup.scss';
import './BananaFlashSalePopup.scss';

interface BananaFlashSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatCountdown(msRemaining: number): string {
  if (msRemaining <= 0) return '00:00:00';
  const totalSec = Math.floor(msRemaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const hs = h > 99 ? String(h) : String(h).padStart(2, '0');
  return `${hs}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const BananaFlashSalePopup: React.FC<BananaFlashSalePopupProps> = ({
  isOpen,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayNow, setDisplayNow] = useState(() => Date.now());

  const now = displayNow;
  const phase: 'upcoming' | 'live' | 'ended' =
    now >= BANANA_EVENT_END_MS
      ? 'ended'
      : now >= BANANA_EVENT_START_MS
        ? 'live'
        : 'upcoming';

  const targetMs =
    phase === 'upcoming' ? BANANA_EVENT_START_MS : BANANA_EVENT_END_MS;
  const label = phase === 'upcoming' ? 'Starting in' : 'Ends in';
  const remaining = Math.max(0, targetMs - now);
  const timeStr = formatCountdown(remaining);

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

  if (!isOpen || phase === 'ended') return null;

  return (
    <>
      <div className="flash-sale-banner visible banana-flash-sale-banner">
        <div className="banner-container">
          <div className="banner-slider">
            <div className="banner-content">
              <span className="banner-text banana-banner-text">
                <span className="banana-banner-headline">
                  <span className="text-desktop">
                    1 BUNCH FREE BANANAS — SATURDAY, MARCH 28
                  </span>
                  <span className="text-mobile">FREE BANANAS · SAT MAR 28</span>
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
              src="/banana-ad-copy.webp"
              alt="Free bananas Saturday March 28 — 1 bunch"
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
