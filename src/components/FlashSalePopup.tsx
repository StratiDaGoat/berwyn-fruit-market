import React, { useState, useEffect, useRef } from 'react';
import './FlashSalePopup.scss';

interface FlashSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FlashSalePopup: React.FC<FlashSalePopupProps> = ({ isOpen, onClose }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<'eggs' | 'raffle'>('eggs');
  const [timeLeft, setTimeLeft] = useState('');
  const [raffleTimeLeft, setRaffleTimeLeft] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize expiration state based on current time to prevent flash of expired content (Feb 3, 9 PM Central)
  const [isEggExpired, setIsEggExpired] = useState(() => {
    const targetDate = new Date('2026-02-03T21:00:00-06:00');
    return new Date() > targetDate;
  });

  // Super Bowl raffle ends Friday 9:00 PM Central — hide ad when countdown hits 0
  const [isRaffleExpired, setIsRaffleExpired] = useState(() => {
    const targetDate = new Date('2026-02-06T21:00:00-06:00'); // Feb 6, 2026 9 PM Central
    return new Date() > targetDate;
  });

  // Use refs for intervals to ensure cleanups
  const eggTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const raffleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const banners = [
    {
      id: 'eggs',
      text: 'EGG-SCELLENT DEALS! CHEAPEST EGGS IN THE CHICAGOLAND AREA',
      mobileText: 'JUMBO EGGS 99¢',
      showTimer: true,
      timerValue: timeLeft,
      popupImage: '/egg-promo-til-feb3.webp',
      popupTitle: 'JUMBO EGGS 99¢',
      backgroundColor: '#0ea5e9', // Light Blue
      textColor: 'white',
      timerColor: '#ffeb3b',
      buttonBackgroundColor: 'white',
      buttonTextColor: '#0ea5e9',
    },
    {
      id: 'raffle',
      text: 'SUPER BOWL RAFFLE',
      mobileText: 'SUPER BOWL RAFFLE',
      showTimer: true,
      timerValue: raffleTimeLeft,
      popupImage: '/super-bowl-promo-date-changed.webp',
      popupTitle: 'SUPER BOWL RAFFLE',
      backgroundColor: '#0B162A', // Bears Navy Blue
      textColor: '#c83803', // Bears Orange
      timerColor: '#c83803',
      buttonBackgroundColor: '#c83803',
      buttonTextColor: '#0B162A',
    },
  ].filter(banner => (banner.id !== 'eggs' || !isEggExpired) && (banner.id !== 'raffle' || !isRaffleExpired));

  // Egg Timer
  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2026-02-03T21:00:00-06:00'); // Feb 3, 9:00 PM Central

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('0 DAYS 0 HOURS 0 MIN');
        setIsEggExpired(true);
        return true;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const days = Math.floor(totalHours / 24);
      const hours = totalHours % 24;
      const minutes = totalMinutes % 60;

      const parts: string[] = [];
      if (days > 0) {
        parts.push(`${days}D`);
        parts.push(`${hours}H`);
        parts.push(`${minutes}M`);
      } else {
        // Less than 24 hours: Show Hours, Min, Sec
        const seconds = totalSeconds % 60;
        if (hours > 0) parts.push(`${hours}H`);
        parts.push(`${minutes}M`);
        parts.push(`${seconds}S`);
      }

      setTimeLeft(parts.join(' ') || '0M');
      return false;
    };

    if (updateTimer()) return;

    // Optimize: Update every second, but ensure we clear previous
    if (eggTimerRef.current) clearInterval(eggTimerRef.current);
    eggTimerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (eggTimerRef.current) clearInterval(eggTimerRef.current);
    };
  }, [isOpen]);

  // Raffle Timer — ends Friday 9:00 PM Central; ad disappears at 0:00:00
  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2026-02-06T21:00:00-06:00'); // Feb 6, 2026 9 PM Central

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setRaffleTimeLeft('0H 0M 0S');
        setIsRaffleExpired(true);
        return true;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);

      if (totalHours < 24) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours}H`);
        parts.push(`${minutes}M`);
        parts.push(`${seconds}S`);

        setRaffleTimeLeft(parts.join(' '));
      } else {
        let months = 0;
        let checkDate = new Date(now);

        while (checkDate < targetDate) {
          const nextMonth = new Date(checkDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          if (nextMonth <= targetDate) {
            months++;
            checkDate = nextMonth;
          } else {
            break;
          }
        }

        const days = Math.floor((targetDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        const remainingTime = targetDate.getTime() - checkDate.getTime() - (days * 1000 * 60 * 60 * 24);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

        const parts: string[] = [];
        if (months > 0) {
          parts.push(`${months}MO`);
          parts.push(`${days}D`);
          parts.push(`${hours}H`);
        } else {
          // 0 Months left: Show Days, Hours, Min
          parts.push(`${days}D`);
          parts.push(`${hours}H`);
          parts.push(`${minutes}M`);
        }

        setRaffleTimeLeft(parts.join(' '));
      }
      return false;
    };

    if (updateTimer()) return;

    if (raffleTimerRef.current) clearInterval(raffleTimerRef.current);
    raffleTimerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (raffleTimerRef.current) clearInterval(raffleTimerRef.current);
    };
  }, [isOpen]);

  // Carousel Logic
  useEffect(() => {
    if (!isOpen || banners.length <= 1) return;

    if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    carouselTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsTransitioning(false);
      }, 500);
    }, 6500);

    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [isOpen, banners.length]);

  const handleViewClick = () => {
    const safeIndex = currentBannerIndex >= banners.length ? 0 : currentBannerIndex;
    const activeBanner = banners[safeIndex];
    if (activeBanner) {
      setPopupType(activeBanner.id as 'eggs' | 'raffle');
      setIsPopupVisible(true);
    }
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  // Ensure currentBannerIndex is valid if banners array shrinks
  useEffect(() => {
    if (currentBannerIndex >= banners.length && banners.length > 0) {
      setCurrentBannerIndex(0);
    }
  }, [banners.length, currentBannerIndex]);

  return (
    <>
      {/* Flash Sale Banner */}
      {/* Flash Sale Banner */}
      {isOpen && banners.length > 0 && (
        (() => {
          const safeIndex = currentBannerIndex >= banners.length ? 0 : currentBannerIndex;
          const activeBanner = banners[safeIndex];
          return (
            <div
              className="flash-sale-banner visible"
              style={{
                backgroundColor: activeBanner.backgroundColor,
                transition: 'background-color 0.5s ease-in-out',
                minHeight: '60px', // Enforce min-height to reduce CLS
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div className="banner-container">
                <div className={`banner-slider ${isTransitioning ? 'sliding' : ''}`}>
                  <div className="banner-content">
                    <span
                      className="banner-text"
                      style={{ color: activeBanner.textColor }}
                    >
                      <span className="text-desktop">{activeBanner.text}</span>
                      <span className="text-mobile">{activeBanner.mobileText}</span>
                      {activeBanner.showTimer && activeBanner.timerValue && (
                        <span className="banner-timer" style={{ marginLeft: '10px', fontWeight: 'bold', color: activeBanner.timerColor }}>
                          ENDS IN {activeBanner.timerValue}
                        </span>
                      )}
                    </span>
                    <button
                      className="view-btn"
                      onClick={handleViewClick}
                      style={{
                        backgroundColor: activeBanner.buttonBackgroundColor,
                        color: activeBanner.buttonTextColor,
                        borderColor: activeBanner.buttonBackgroundColor
                      }}
                    >
                      VIEW
                    </button>
                  </div>
                </div>
                <button className="banner-close-btn" onClick={onClose} aria-label="Close banner">
                  ×
                </button>
              </div>
            </div>
          );
        })()
      )}

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="flash-sale-popup">
          <div className="popup-content">
            <div
              className="popup-header"
              style={{
                backgroundColor: popupType === 'raffle' ? '#0B162A' : '#0ea5e9',
                color: popupType === 'raffle' ? '#c83803' : 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 10px',
                minHeight: '50px', // Ensure consistent height
                gap: '5px'
              }}
            >
              {/* Spacer to balance the close button for perfect centering */}
              <div style={{ width: '30px' }} />

              {/* Timer for Eggs */}
              {popupType === 'eggs' && timeLeft && (
                <span style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#ffeb3b', whiteSpace: 'nowrap', flex: 1, textAlign: 'center' }}>
                  ENDS IN {timeLeft}
                </span>
              )}
              {/* Timer for Raffle */}
              {popupType === 'raffle' && raffleTimeLeft && (
                <span style={{ fontWeight: 'bold', fontSize: '0.85em', color: '#c83803', whiteSpace: 'nowrap', flex: 1, textAlign: 'center' }}>
                  ENDS IN {raffleTimeLeft}
                </span>
              )}

              <button
                className="close-btn"
                onClick={handleClosePopup}
                style={{
                  width: '30px',
                  height: '30px',
                  borderColor: popupType === 'raffle' ? '#c83803' : 'white',
                  color: popupType === 'raffle' ? '#c83803' : 'white',
                  flexShrink: 0 // Prevent button from squishing
                }}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <div className="popup-image">
              <img
                src={popupType === 'eggs' ? '/egg-promo-til-feb3.webp' : '/super-bowl-promo-date-changed.webp'}
                alt={popupType === 'eggs' ? 'Egg Promo' : 'Super Bowl Raffle'}
                loading="lazy"
                width={popupType === 'eggs' ? "3300" : "1440"}
                height={popupType === 'eggs' ? "5100" : "1800"}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashSalePopup;
