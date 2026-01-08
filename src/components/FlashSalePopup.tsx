import React, { useState, useEffect } from 'react';
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

  const banners = [
    {
      id: 'eggs',
      text: 'EGG-SCELLENT DEALS! CHEAPEST EGGS IN THE CHICAGOLAND AREA',
      showTimer: true,
      timerValue: timeLeft,
      popupImage: '/egg-promo-1-7.webp',
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
      showTimer: true,
      timerValue: raffleTimeLeft,
      popupImage: '/super-bowl-raffle.webp',
      popupTitle: 'SUPER BOWL RAFFLE',
      backgroundColor: '#0B162A', // Bears Navy Blue
      textColor: '#c83803', // Bears Orange
      timerColor: '#c83803',
      buttonBackgroundColor: '#c83803',
      buttonTextColor: '#0B162A',
    },
  ];

  // Egg Timer
  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2026-01-14T21:00:00-06:00'); // Updated to match PromoBanner logic

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft('0 DAYS 0 HOURS 0 MIN');
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
        parts.push(`${days} ${days === 1 ? 'DAY' : 'DAYS'}`);
        parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
        parts.push(`${minutes} ${minutes === 1 ? 'MIN' : 'MIN'}`);
      } else {
        // Less than 24 hours: Show Hours, Min, Sec
        const seconds = totalSeconds % 60;
        if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
        parts.push(`${minutes} ${minutes === 1 ? 'MIN' : 'MIN'}`);
        parts.push(`${seconds} SEC`);
      }

      setTimeLeft(parts.join(' ') || '0 MIN');
      return false;
    };

    if (updateTimer()) return;
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Raffle Timer
  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2026-02-08T21:00:00-06:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setRaffleTimeLeft('0 MONTHS 0 DAYS');
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
        if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
        parts.push(`${minutes} ${minutes === 1 ? 'MIN' : 'MIN'}`);
        parts.push(`${seconds} SEC`);

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
          parts.push(`${months} ${months === 1 ? 'MONTH' : 'MONTHS'}`);
          parts.push(`${days} ${days === 1 ? 'DAY' : 'DAYS'}`);
          parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
        } else {
          // 0 Months left: Show Days, Hours, Min
          parts.push(`${days} ${days === 1 ? 'DAY' : 'DAYS'}`);
          parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
          parts.push(`${minutes} ${minutes === 1 ? 'MIN' : 'MIN'}`);
        }

        setRaffleTimeLeft(parts.join(' '));
      }
      return false;
    };

    if (updateTimer()) return;
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Carousel Logic
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % banners.length);
        setIsTransitioning(false);
      }, 500);
    }, 6500);

    return () => clearInterval(interval);
  }, [isOpen, banners.length]);

  const handleViewClick = () => {
    setPopupType(banners[currentBannerIndex].id as 'eggs' | 'raffle');
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {/* Flash Sale Banner */}
      {isOpen && (
        <div
          className="flash-sale-banner visible"
          style={{
            backgroundColor: banners[currentBannerIndex].backgroundColor,
            transition: 'background-color 0.5s ease-in-out'
          }}
        >
          <div className="banner-container">
            <div className={`banner-slider ${isTransitioning ? 'sliding' : ''}`}>
              <div className="banner-content">
                <span
                  className="banner-text"
                  style={{ color: banners[currentBannerIndex].textColor }}
                >
                  {banners[currentBannerIndex].text}
                  {banners[currentBannerIndex].showTimer && banners[currentBannerIndex].timerValue && (
                    <span style={{ marginLeft: '10px', fontWeight: 'bold', color: banners[currentBannerIndex].timerColor }}>
                      ENDS IN {banners[currentBannerIndex].timerValue}
                    </span>
                  )}
                </span>
                <button
                  className="view-btn"
                  onClick={handleViewClick}
                  style={{
                    backgroundColor: banners[currentBannerIndex].buttonBackgroundColor,
                    color: banners[currentBannerIndex].buttonTextColor,
                    borderColor: banners[currentBannerIndex].buttonBackgroundColor
                  }}
                >
                  VIEW
                </button>
              </div>
            </div>
            <button className="banner-close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="flash-sale-popup">
          <div className="popup-content">
            <div
              className="popup-header"
              style={{
                backgroundColor: popupType === 'raffle' ? '#0B162A' : '#0ea5e9',
                color: popupType === 'raffle' ? '#c83803' : 'white'
              }}
            >
              <span className="flash-sale-text">
                {popupType === 'eggs' ? 'JUMBO EGGS 99¢' : 'SUPER BOWL RAFFLE'}
              </span>
              <button
                className="close-btn"
                onClick={handleClosePopup}
                style={{
                  borderColor: popupType === 'raffle' ? '#c83803' : 'white',
                  color: popupType === 'raffle' ? '#c83803' : 'white'
                }}
              >
                ×
              </button>
            </div>
            <div className="popup-image">
              <img
                src={popupType === 'eggs' ? '/egg-promo-1-7.webp' : '/super-bowl-raffle.webp'}
                alt={popupType === 'eggs' ? 'Egg Promo' : 'Super Bowl Raffle'}
                loading="lazy"
                width="3300"
                height="5100"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashSalePopup;
