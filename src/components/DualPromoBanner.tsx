import React, { useEffect, useRef, useState } from 'react';
import './FlashSalePopup.scss';
import './DualPromoBanner.scss';

interface DualPromoBannerProps {
  isOpen: boolean;
  onClose: () => void;
}

type PromoId = 'chips-ahoy' | 'banana';

interface PromoConfig {
  id: PromoId;
  desktopText: string;
  mobileTitle: string;
  mobileSub: string;
  background: string;
  borderBottom: string;
  textColor: string;
  subTextColor: string;
  buttonBg: string;
  buttonColor: string;
  buttonBorder: string;
  closeBorder: string;
  closeColor: string;
  closeHoverBg: string;
  closeHoverColor: string;
  popupImage: string;
  popupTitle: string;
  popupHeaderBg: string;
  popupBorder: string;
  popupCloseBorder: string;
  popupCloseColor: string;
}

const PROMOS: PromoConfig[] = [
  {
    id: 'chips-ahoy',
    desktopText:
      'SPECIAL! Chips Ahoy! Party Size — Only $3.99 · While Supplies Last',
    mobileTitle: 'Chips Ahoy! Party Size',
    mobileSub: '$3.99 · While Supplies Last',
    background: 'linear-gradient(90deg, #0057a0 0%, #007ad9 50%, #0057a0 100%)',
    borderBottom: '#d32f2f',
    textColor: '#ffffff',
    subTextColor: '#ffca28',
    buttonBg: '#d32f2f',
    buttonColor: '#ffffff',
    buttonBorder: '#ffca28',
    closeBorder: 'rgba(255, 255, 255, 0.7)',
    closeColor: '#ffffff',
    closeHoverBg: '#d32f2f',
    closeHoverColor: '#ffffff',
    popupImage: '/chipsahoyad.png',
    popupTitle: 'Chips Ahoy! Party Size — $3.99',
    popupHeaderBg: 'linear-gradient(90deg, #0057a0, #007ad9)',
    popupBorder: '#d32f2f',
    popupCloseBorder: 'rgba(255, 255, 255, 0.7)',
    popupCloseColor: '#ffffff',
  },
  {
    id: 'banana',
    desktopText:
      'June 3rd — 1 FREE BUNCH OF BANANAS · While Supplies Last',
    mobileTitle: 'Free Banana Bunch',
    mobileSub: 'While Supplies Last',
    background: 'linear-gradient(90deg, #ffeb3b 0%, #ffd54f 50%, #ffeb3b 100%)',
    borderBottom: '#212121',
    textColor: '#212121',
    subTextColor: '#c62828',
    buttonBg: '#212121',
    buttonColor: '#ffeb3b',
    buttonBorder: '#212121',
    closeBorder: '#212121',
    closeColor: '#212121',
    closeHoverBg: '#c62828',
    closeHoverColor: '#ffeb3b',
    popupImage: '/banana-june-3.webp',
    popupTitle: 'Free Banana Bunch — June 3rd',
    popupHeaderBg: 'linear-gradient(90deg, #ffeb3b, #ffd54f)',
    popupBorder: '#c62828',
    popupCloseBorder: '#212121',
    popupCloseColor: '#212121',
  },
];

const ROTATE_MS = 7500;
const SLIDE_MS = 500;

function PromoText({
  promo,
  phase,
}: {
  promo: PromoConfig;
  phase: 'active' | 'entering' | 'leaving';
}) {
  return (
    <span
      className={`banner-text dual-promo-banner__text dual-promo-banner__text--${phase}`}
      style={{ color: promo.textColor }}
    >
      <span className="dual-promo-banner__headline">
        <span className="text-desktop">{promo.desktopText}</span>
        <span className="text-mobile">
          <span className="dual-promo-banner__mobile-line dual-promo-banner__mobile-line--title">
            {promo.mobileTitle}
          </span>
          <span
            className="dual-promo-banner__mobile-line dual-promo-banner__mobile-line--sub"
            style={{ color: promo.subTextColor }}
          >
            {promo.mobileSub}
          </span>
        </span>
      </span>
    </span>
  );
}

const DualPromoBanner: React.FC<DualPromoBannerProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);
  const [popupPromo, setPopupPromo] = useState<PromoId | null>(null);
  const carouselRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animating = leavingIndex !== null && enteringIndex !== null;

  const themePromo = PROMOS[enteringIndex ?? activeIndex];
  const uiPromo = themePromo;
  const popupConfig = PROMOS.find(p => p.id === popupPromo);

  useEffect(() => {
    if (!isOpen || PROMOS.length <= 1) return;

    const advance = () => {
      setActiveIndex(current => {
        const next = (current + 1) % PROMOS.length;
        setLeavingIndex(current);
        setEnteringIndex(next);
        window.setTimeout(() => {
          setActiveIndex(next);
          setLeavingIndex(null);
          setEnteringIndex(null);
        }, SLIDE_MS);
        return current;
      });
    };

    carouselRef.current = setInterval(advance, ROTATE_MS);

    return () => {
      if (carouselRef.current) clearInterval(carouselRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const activePromo = PROMOS[activeIndex];

  return (
    <>
      <div
        className={`flash-sale-banner visible dual-promo-banner dual-promo-banner--${themePromo.id}`}
        style={{
          background: themePromo.background,
          borderBottom: `3px solid ${themePromo.borderBottom}`,
        }}
      >
        <div className="banner-container">
          <div className="banner-slider">
            <div className="banner-content">
              <div className="dual-promo-banner__text-track">
                {animating && leavingIndex !== null && (
                  <PromoText promo={PROMOS[leavingIndex]} phase="leaving" />
                )}
                {animating && enteringIndex !== null && (
                  <PromoText promo={PROMOS[enteringIndex]} phase="entering" />
                )}
                {!animating && (
                  <PromoText promo={PROMOS[activeIndex]} phase="active" />
                )}
              </div>
              <button
                type="button"
                className="view-btn dual-promo-banner__view-btn"
                style={{
                  backgroundColor: uiPromo.buttonBg,
                  color: uiPromo.buttonColor,
                  borderColor: uiPromo.buttonBorder,
                }}
                onClick={() => setPopupPromo(activePromo.id)}
              >
                VIEW
              </button>
            </div>
          </div>
          <button
            type="button"
            className="banner-close-btn dual-promo-banner__close-btn"
            style={{
              borderColor: uiPromo.closeBorder,
              color: uiPromo.closeColor,
            }}
            onClick={onClose}
            aria-label="Close banner"
          >
            ×
          </button>
        </div>
      </div>

      {popupConfig && (
        <div
          className={`dual-promo-popup dual-promo-popup--${popupConfig.id}`}
          role="dialog"
          aria-modal="true"
          onClick={() => setPopupPromo(null)}
        >
          <div
            className="dual-promo-popup__panel"
            style={{ borderColor: popupConfig.popupBorder }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="dual-promo-popup__header"
              style={{
                background: popupConfig.popupHeaderBg,
                color: popupConfig.textColor,
                borderBottomColor: popupConfig.popupBorder,
              }}
            >
              <div style={{ width: 32 }} aria-hidden />
              <div className="dual-promo-popup__title">{popupConfig.popupTitle}</div>
              <button
                type="button"
                className="dual-promo-popup__close"
                style={{
                  borderColor: popupConfig.popupCloseBorder,
                  color: popupConfig.popupCloseColor,
                }}
                onClick={() => setPopupPromo(null)}
                aria-label="Close popup"
              >
                ×
              </button>
            </div>
            <div className="dual-promo-popup__image-wrap">
              <img
                src={popupConfig.popupImage}
                alt={popupConfig.popupTitle}
                loading="lazy"
                width="1200"
                height="1600"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DualPromoBanner;
