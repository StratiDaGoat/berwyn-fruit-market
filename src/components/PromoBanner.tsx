import React, { useState, useEffect } from 'react';
import './PromoBanner.scss';

interface PromoBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ isOpen, onClose }) => {
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [prevPromoIndex, setPrevPromoIndex] = useState(0);
  const [raffleTimeLeft, setRaffleTimeLeft] = useState('');
  const [eggTimeLeft, setEggTimeLeft] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<'raffle' | 'eggs'>('raffle');

  // Promo definitions
  const promos = [
    {
      id: 'raffle',
      text: 'SUPER BOWL RAFFLE',
      link: '/raffle',
      buttonText: 'View Now',
    },
    {
      id: 'eggs',
      text: 'Egg Promo 🥚 Cheapest Eggs in the Chicago Land Area',
      link: '/specials',
      buttonText: 'View Now',
    },
  ];

  // Timer calculation for raffle
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
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        setRaffleTimeLeft(`${minutes} MIN ${seconds} SEC`);
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

        const parts: string[] = [];
        if (months > 0) {
          parts.push(`${months} ${months === 1 ? 'MONTH' : 'MONTHS'}`);
        }
        if (days > 0) {
          parts.push(`${days} ${days === 1 ? 'DAY' : 'DAYS'}`);
        }
        if (hours > 0) {
          parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
        }

        setRaffleTimeLeft(parts.join(' '));
      }

      return false;
    };

    if (updateTimer()) return;

    const interval = setInterval(() => {
      if (updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Timer calculation for eggs (ends January 14th at 9:00 PM)
  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2026-01-14T21:00:00-06:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setEggTimeLeft('0 DAYS 0 HOURS 0 MIN');
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
      }
      if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? 'HOUR' : 'HOURS'}`);
      }
      if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? 'MIN' : 'MIN'}`);
      }

      setEggTimeLeft(parts.join(' ') || '0 MIN');

      return false;
    };

    if (updateTimer()) return;

    const interval = setInterval(() => {
      if (updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Rotate active promo every 7.5 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setPrevPromoIndex(activePromoIndex);
      // Small delay to allow leaving animation to start
      setTimeout(() => {
        setActivePromoIndex(prev => (prev + 1) % promos.length);
      }, 50);
    }, 7500); // 7.5 seconds

    return () => clearInterval(interval);
  }, [isOpen, promos.length, activePromoIndex]);

  const currentPromo = promos[activePromoIndex];
  const isRaffle = currentPromo.id === 'raffle';

  if (!isOpen) return null;

  return (
    <>
      <div className={`promo-banner promo-banner--${isRaffle ? 'raffle' : 'eggs'}`}>
        <div className="promo-banner__content">
          {/* Promo Text Section */}
          <div className="promo-banner__text-wrapper">
            {promos.map((promo, index) => {
              const isActive = activePromoIndex === index;
              const isLeaving = prevPromoIndex === index && !isActive;
              
              return (
                <div
                  key={`${promo.id}-${index}`}
                  className={`promo-banner__text promo-banner__text--${promo.id} ${
                    isActive ? 'promo-banner__text--active' : ''
                  } ${isLeaving ? 'promo-banner__text--leaving' : ''}`}
                >
                  {promo.id === 'raffle' && raffleTimeLeft ? (
                    <span>
                      {promo.text} <span className="promo-banner__timer">{raffleTimeLeft}</span>
                    </span>
                  ) : promo.id === 'eggs' && eggTimeLeft ? (
                    <span>
                      {promo.text} <span className="promo-banner__timer">{eggTimeLeft}</span>
                    </span>
                  ) : (
                    <span>{promo.text}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* View Now Button */}
          <div className="promo-banner__actions">
            {promos.map((promo, index) => (
              <button
                key={promo.id}
                onClick={() => {
                  setPopupType(promo.id as 'raffle' | 'eggs');
                  setIsPopupVisible(true);
                }}
                className={`promo-banner__button promo-banner__button--${promo.id} ${
                  activePromoIndex === index ? 'promo-banner__button--active' : ''
                }`}
              >
                {promo.buttonText}
              </button>
            ))}

            {/* Close Button - Always visible and static */}
            <button
              className="promo-banner__close-btn"
              onClick={onClose}
              aria-label="Close banner"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Popup Modal - Outside banner */}
      {isPopupVisible && (
        <div className="promo-banner__popup" onClick={() => setIsPopupVisible(false)}>
          <div
            className={`promo-banner__popup-content ${
              popupType === 'eggs' ? 'promo-banner__popup-content--eggs' : ''
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="promo-banner__popup-header">
              <span className="promo-banner__popup-title">
                {popupType === 'raffle' ? 'SUPER BOWL RAFFLE' : 'EGG PROMO'}
              </span>
              <button
                className="promo-banner__popup-close"
                onClick={() => setIsPopupVisible(false)}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <div className="promo-banner__popup-image">
              {popupType === 'raffle' ? (
                <img
                  src="/super-bowl-raffle.webp"
                  alt="Super Bowl Raffle"
                  loading="lazy"
                  width="3300"
                  height="5100"
                />
              ) : (
                <img
                  src="/ egg promo 1:7.png"
                  alt="Egg Promo"
                  loading="lazy"
                  width="3300"
                  height="5200"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromoBanner;

