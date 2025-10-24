import React, { useState, useEffect } from 'react';
import './FlashSalePopup.scss';

const FlashSalePopup: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    const header = document.querySelector('.header');
    const mainContent = document.querySelector('.main-content');
    
    if (header) {
      if (isBannerVisible) {
        header.classList.add('with-banner');
      } else {
        header.classList.remove('with-banner');
      }
    }
    
    if (mainContent) {
      if (isBannerVisible) {
        mainContent.classList.add('with-banner');
      } else {
        mainContent.classList.remove('with-banner');
      }
    }
  }, [isBannerVisible]);


  const handleViewClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  const handleCloseBanner = () => {
    setIsBannerVisible(false);
  };

  return (
    <>
      {/* Flash Sale Banner */}
      {isBannerVisible && (
        <div className="flash-sale-banner visible">
          <div className="banner-content">
            <span className="banner-text">FLASH SALE FRESH CROP MICHIGAN APPLES STARTING TODAY</span>
            <button className="view-btn" onClick={handleViewClick}>
              VIEW
            </button>
            <button className="banner-close-btn" onClick={handleCloseBanner}>
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
              <span className="flash-sale-text">FLASH SALE</span>
              <button className="close-btn" onClick={handleClosePopup}>
                ×
              </button>
            </div>
                <div className="popup-image">
                  <img src="/ad-with-logo.png" alt="Michigan Apple Flash Sale" />
                </div>
          </div>
        </div>
      )}
      
    </>
  );
};

export default FlashSalePopup;
