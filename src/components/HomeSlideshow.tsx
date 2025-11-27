import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface HomeSlideshowProps {
  images?: string[]; // explicit list of image URLs under public
  intervalMs?: number;
  className?: string;
}

export const HomeSlideshow: React.FC<HomeSlideshowProps> = ({
  images,
  intervalMs = 3500,
  className,
}) => {
  const imageUrls = useMemo(() => {
    if (images && images.length > 0) return images;
    // Default: include home slides 1-11
    return [
      '/home-slide-1.jpg',
      '/home-slide-2.jpg',
      '/home-slide-3.jpg',
      '/home-slide-4.jpg',
      '/home-slide-5.jpg',
      '/home-slide-6.jpg',
      '/home-slide-7.jpg',
      '/home-slide-8.jpg',
      '/home-slide-9.jpg',
      '/home-slide-10.jpg',
      '/home-slide-11.jpg',
    ];
  }, [images]);

  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [pausedUntil, setPausedUntil] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [isReady, setIsReady] = useState(false);
  const [isFirstImageReady, setIsFirstImageReady] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Simplified loading - no blob URLs for faster mobile performance
  const loadedImagesRef = useRef<Set<string>>(new Set());
  const loadingImagesRef = useRef<Set<string>>(new Set());

  // Simplified image preloading - faster for mobile
  const preloadImage = React.useCallback((url: string): Promise<void> => {
    if (loadedImagesRef.current.has(url)) return Promise.resolve();
    if (loadingImagesRef.current.has(url)) {
      // Wait for existing load
      return new Promise(resolve => {
        const checkInterval = setInterval(() => {
          if (loadedImagesRef.current.has(url)) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(); // Timeout after 5s
        }, 5000);
      });
    }
    
    loadingImagesRef.current.add(url);
    const promise = new Promise<void>(resolve => {
      const img = new Image();
      img.src = url;
      img.loading = 'lazy'; // Use lazy loading for non-critical images
      
      const finalize = () => {
        loadedImagesRef.current.add(url);
        loadingImagesRef.current.delete(url);
        resolve();
      };
      
      if (img.complete) {
        finalize();
      } else {
        img.onload = finalize;
        img.onerror = finalize;
        // Timeout after 3 seconds
        setTimeout(finalize, 3000);
      }
    });
    return promise;
  }, []);

  // Auto-advance timer - works on both desktop and mobile
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    if (!isReady) return;
    
    const timer = setInterval(() => {
      if (!isSliding && Date.now() >= pausedUntil) {
        setIsInitialRender(false);
        setDirection('forward');
        setIndex(i => {
          setPrevIndex(i);
          return (i + 1) % imageUrls.length;
        });
      }
    }, intervalMs);
    
    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, pausedUntil, isSliding, isReady]);

  // Optimized loading: Show first image immediately, lazy load others
  useEffect(() => {
    if (imageUrls.length <= 1) {
      setIsReady(true);
      setIsFirstImageReady(true);
      return;
    }

    let isCancelled = false;

    (async () => {
      try {
        // Step 1: Load first image immediately - show it right away
        const firstUrl = imageUrls[0];
        await preloadImage(firstUrl);
        if (!isCancelled) {
          setIsFirstImageReady(true);
          setIsReady(true); // Allow slideshow to start
          setIsInitialRender(false);
        }

        // Step 2: Preload next 2-3 images in background (for smooth transitions)
        const nextImages = imageUrls.slice(1, 4);
        Promise.all(nextImages.map(url => preloadImage(url))).catch(() => {
          // Ignore errors, continue anyway
        });

        // Step 3: Lazy load remaining images as user progresses
        // This happens in the opportunistic preload effect below
      } catch {
        // Even on error, show first frame to avoid blank screen
        if (!isCancelled) {
          setIsFirstImageReady(true);
          setIsReady(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [imageUrls, preloadImage]);

  // Opportunistically preload next images for smooth transitions
  useEffect(() => {
    if (imageUrls.length <= 1 || !isReady) return;
    const preloadTargets = [
      (index + 1) % imageUrls.length,
      (index + 2) % imageUrls.length,
    ];
    preloadTargets.forEach(t => {
      const url = imageUrls[t];
      void preloadImage(url);
    });
  }, [index, imageUrls, isReady, preloadImage]);

  // No pre-active phase; keep bubbles smooth with layout transitions only

  const pauseAuto = () => setPausedUntil(Date.now() + 3000);

  const slideToIndex = async (target: number) => {
    if (isSliding) return;
    setIsInitialRender(false);
    const normalizedTarget =
      ((target % imageUrls.length) + imageUrls.length) % imageUrls.length;
    const targetUrl = imageUrls[normalizedTarget];
    
    // Preload target image if not already loaded (non-blocking)
    void preloadImage(targetUrl);
    
    setIsSliding(true);
    pauseAuto();
    setIndex(i => {
      setPrevIndex(i);
      return normalizedTarget;
    });
    const unlockMs = 820;
    setTimeout(() => setIsSliding(false), unlockMs);
  };

  const goPrev = () => {
    if (isSliding) return;
    setDirection('backward');
    void slideToIndex(index - 1);
  };
  
  const goNext = () => {
    if (isSliding) return;
    setDirection('forward');
    void slideToIndex(index + 1);
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <div
        className={className}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'contents',
        }}
      >
        {/* Loading skeleton - shown before first image loads */}
        {!isFirstImageReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              zIndex: 10,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: '#9e9e9e',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  border: '4px solid #e0e0e0',
                  borderTop: '4px solid #4caf50',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 16px',
                }}
              />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>
                Loading images...
              </p>
            </div>
          </div>
        )}
        {/* Show static first image until slideshow is ready */}
        {(!isReady || (isInitialRender && index === 0)) && isFirstImageReady && (
          <img
            key={`static-${imageUrls[0]}`}
            src={imageUrls[0]}
            alt="home slide"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              zIndex: isInitialRender && index === 0 ? 2 : 1,
              animation: 'fadeIn 0.5s ease-in',
            }}
            draggable={false}
            loading="eager"
            fetchPriority="high"
          />
        )}
        {/* Previous image (leaving) */}
        {isReady && prevIndex !== index && (
          <motion.img
            key={`leave-${imageUrls[prevIndex]}-${direction}`}
            src={imageUrls[prevIndex]}
            alt="home slide previous"
            initial={{ x: 0, opacity: 1 }}
            animate={{ x: direction === 'forward' ? '-100%' : '100%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              willChange: 'transform',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
            }}
            draggable={false}
            loading="lazy"
            onError={e => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src.endsWith('.jpg'))
                target.src = target.src.replace('.jpg', '.png');
            }}
          />
        )}
        {/* Current image (entering) */}
        {isReady && (
          <motion.img
            key={`enter-${imageUrls[index]}-${direction}`}
            src={imageUrls[index]}
            alt="home slide"
            initial={
              isInitialRender && index === 0
                ? { x: 0, opacity: 1 }
                : { x: direction === 'forward' ? '100%' : '-100%', opacity: 1 }
            }
            animate={{ x: 0 }}
            transition={
              isInitialRender && index === 0
                ? { duration: 0 }
                : { duration: 0.8, ease: 'easeInOut' }
            }
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              willChange: 'transform',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              perspective: 1000,
              WebkitPerspective: 1000,
            }}
            draggable={false}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            onError={e => {
              const target = e.currentTarget as HTMLImageElement;
              if (target.src.endsWith('.jpg'))
                target.src = target.src.replace('.jpg', '.png');
            }}
          />
        )}

        {/* Controls (arrows) */}
        {isReady && imageUrls.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={goPrev}
              disabled={isSliding}
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background 0.2s, opacity 0.2s',
                opacity: isSliding ? 0.5 : 1,
                pointerEvents: isSliding ? 'none' : 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: '24px',
                  height: '24px',
                  fill: '#333',
                }}
                aria-hidden="true"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={goNext}
              disabled={isSliding}
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                transition: 'background 0.2s, opacity 0.2s',
                opacity: isSliding ? 0.5 : 1,
                pointerEvents: isSliding ? 'none' : 'auto',
                touchAction: 'manipulation',
                WebkitTapHighlightColor: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: '24px',
                  height: '24px',
                  fill: '#333',
                }}
                aria-hidden="true"
              >
                <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
              </svg>
            </button>
          </>
        )}

        {/* Bubbles removed as requested */}
      </div>
    </>
  );
};

export default HomeSlideshow;
