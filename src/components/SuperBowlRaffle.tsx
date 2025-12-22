import React, { useState, useEffect } from 'react';
import './SuperBowlRaffle.scss';

interface SuperBowlRaffleProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuperBowlRaffle: React.FC<SuperBowlRaffleProps> = ({ isOpen, onClose }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    // February 8th at 9:00pm Central Time
    const targetDate = new Date('2026-02-08T21:00:00-06:00');

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        onClose();
        setTimeLeft('0M 0D 0M');
        return true;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      
      // Only show minutes and seconds if less than 24 hours remain
      if (totalHours < 24) {
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        setTimeLeft(`${minutes} MIN ${seconds} SEC`);
      } else {
        // Calculate months properly
        let months = 0;
        let checkDate = new Date(now);
        
        // Calculate months by checking how many full months have passed
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
        
        // Calculate remaining days
        const days = Math.floor((targetDate.getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24));
        // Calculate remaining hours after days
        const remainingTime = targetDate.getTime() - checkDate.getTime() - (days * 1000 * 60 * 60 * 24);
        const hours = Math.floor(remainingTime / (1000 * 60 * 60));
        
        // Build the time string with proper pluralization
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
        
        setTimeLeft(parts.join(' '));
      }
      
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
    setIsDropdownVisible(true);
  };

  const handleCloseDropdown = () => {
    setIsDropdownVisible(false);
  };

  return (
    <>
      {/* Super Bowl Raffle Banner */}
      {isOpen && (
        <div className="super-bowl-raffle-banner visible">
          <div className="banner-content">
            <span className="banner-text">
              SUPER BOWL RAFFLE
              {timeLeft && (
                <span className="timer-text">
                  {timeLeft}
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

      {/* Super Bowl Raffle Dropdown */}
      {isDropdownVisible && (
        <div className="super-bowl-raffle-dropdown">
          <div className="dropdown-content">
            <div className="dropdown-header">
              <span className="raffle-text">SUPER BOWL RAFFLE</span>
              <button className="close-btn" onClick={handleCloseDropdown}>
                ×
              </button>
            </div>
            <div className="dropdown-image">
              <img
                src="/super-bowl-raffle.webp"
                alt="Super Bowl Raffle"
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

export default SuperBowlRaffle;

