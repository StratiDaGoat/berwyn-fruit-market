import React, { useState, useEffect } from 'react';
import './FlashSalePopup.scss';

interface FlashSalePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const FlashSalePopup: React.FC<FlashSalePopupProps> = ({ isOpen, onClose }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const targetDate = new Date('2025-11-29T00:00:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        onClose();
        setTimeLeft('00:00:00');
        return true;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
      return false;
    };

    // Run immediately
    if (updateTimer()) return;

    const interval = setInterval(() => {
      if (updateTimer()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onClose]);

  const handleViewClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
      {/* Flash Sale Banner */}
      {isOpen && (
        <div className="flash-sale-banner visible">
          <div className="banner-content">
            <span className="banner-text">
              EGG-SCELLENT DEALS! CHEAPEST EGGS IN THE CHICAGOLAND AREA
              {timeLeft && (
                <span style={{ marginLeft: '10px', fontWeight: 'bold', color: '#ffeb3b' }}>
                  ENDS IN {timeLeft}
                </span>
              )}
            </span>
            <button className="view-btn" onClick={handleViewClick}>
              VIEW
            </button>
            <button className="banner-close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </div>
      )}

      {/* Flash Sale Popup */}
      {isPopupVisible && (
        <div className="flash-sale-popup">
          <div className="popup-content">
            <div className="popup-header">
              <span className="flash-sale-text">JUMBO EGGS $1.99</span>
              <button className="close-btn" onClick={handleClosePopup}>
                ×
              </button>
            </div>
            <div className="popup-image">
              <img
                src="/egg-promo.webp"
                alt="Egg Promo - Jumbo Eggs $1.99"
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
