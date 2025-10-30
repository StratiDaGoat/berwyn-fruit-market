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
  const decodedSetRef = useRef<Set<string>>(new Set());
  const inflightRef = useRef<Record<string, Promise<void>>>({});
  const blobUrlMapRef = useRef<Record<string, string>>({});
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  const getRenderUrl = (originalUrl: string): string => {
    return blobUrlMapRef.current[originalUrl] || originalUrl;
  };

  const preloadAndDecode = (url: string): Promise<void> => {
    const renderUrl = getRenderUrl(url);
    if (decodedSetRef.current.has(renderUrl)) return Promise.resolve();
    if (renderUrl in inflightRef.current) return inflightRef.current[renderUrl];
    const promise = new Promise<void>((resolve) => {
      const img = new Image();
      img.src = renderUrl;
      img.loading = 'eager';
      // @ts-ignore decode may not exist in older iOS but is widely available
      const decodePromise: Promise<void> | undefined = typeof img.decode === 'function' ? img.decode() : undefined;
      const finalize = () => {
        decodedSetRef.current.add(renderUrl);
        delete inflightRef.current[renderUrl];
        resolve();
      };
      if (decodePromise) {
        decodePromise.then(finalize).catch(finalize);
      } else {
        img.onload = finalize;
        img.onerror = finalize;
      }
    });
    inflightRef.current[renderUrl] = promise;
    return promise;
  };

  const prefetchToBlobUrl = async (url: string): Promise<string> => {
    if (blobUrlMapRef.current[url]) return blobUrlMapRef.current[url];
    const controller = new AbortController();
    abortControllersRef.current[url] = controller;
    try {
      const response = await fetch(url, { cache: 'force-cache', signal: controller.signal });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      blobUrlMapRef.current[url] = blobUrl;
      return blobUrl;
    } catch {
      // Fallback to original URL on any error
      return url;
    }
  };

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const timer = setInterval(() => {
      if (!isSliding && isReady && Date.now() >= pausedUntil) {
        setDirection('forward');
        setIndex(i => {
          setPrevIndex(i);
          return (i + 1) % imageUrls.length;
        });
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [imageUrls.length, intervalMs, pausedUntil, isSliding, isReady]);

  // Preload ALL images to Blobs and decode them before showing slideshow
  useEffect(() => {
    if (imageUrls.length <= 1) {
      setIsReady(true);
      setIsFirstImageReady(true);
      return;
    }
    
    let isCancelled = false;
    
    (async () => {
      try {
        // Step 1: Fetch first image ASAP to show it immediately
        const firstUrl = imageUrls[0];
        await prefetchToBlobUrl(firstUrl);
        await preloadAndDecode(firstUrl);
        if (!isCancelled) {
          setIsFirstImageReady(true);
        }
        
        // Step 2: Fetch ALL remaining images to Blob URLs in parallel
        const remainingPromises = imageUrls.slice(1).map(url => prefetchToBlobUrl(url));
        await Promise.all(remainingPromises);
        
        if (isCancelled) return;
        
        // Step 3: Decode ALL remaining images in parallel
        const remainingDecodePromises = imageUrls.slice(1).map(url => preloadAndDecode(url));
        await Promise.all(remainingDecodePromises);
        
        if (isCancelled) return;
        
        // Step 4: Mark slideshow ready - all images are now fully loaded and decoded
        setIsReady(true);
      } catch (error) {
        // Even on error, show first frame to avoid blank screen
        if (!isCancelled) {
          setIsFirstImageReady(true);
          setIsReady(true);
        }
      }
    })();

    return () => {
      isCancelled = true;
      // Cleanup inflight fetches and blob URLs
      Object.values(abortControllersRef.current).forEach(c => c.abort());
      abortControllersRef.current = {};
      Object.values(blobUrlMapRef.current).forEach(u => URL.revokeObjectURL(u));
      blobUrlMapRef.current = {} as Record<string, string>;
    };
  }, [imageUrls]);

  // Opportunistically ensure next couple of images are decoded
  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const preloadTargets = [
      (index + 1) % imageUrls.length,
      (index + 2) % imageUrls.length,
    ];
    preloadTargets.forEach(t => {
      const url = imageUrls[t];
      // eslint-disable-next-line no-void
      void prefetchToBlobUrl(url).then(() => preloadAndDecode(url));
    });
  }, [index, imageUrls]);



  // No pre-active phase; keep bubbles smooth with layout transitions only

  const pauseAuto = () => setPausedUntil(Date.now() + 3000);

  const slideToIndex = async (target: number) => {
    if (isSliding) return;
    const normalizedTarget = ((target % imageUrls.length) + imageUrls.length) % imageUrls.length;
    const targetUrl = imageUrls[normalizedTarget];
    await prefetchToBlobUrl(targetUrl);
    // Ensure target frame is decoded before transition
    await preloadAndDecode(targetUrl);
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
    <div 
      className={className} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%', 
        overflow: 'hidden',
        backgroundColor: '#f0f0f0', // Background fallback while first image loads
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        willChange: 'contents'
      }}
    >
      {/* Show nothing until all images are fully preloaded */}
      {!isReady && isFirstImageReady && (
        <img
          key={`static-${imageUrls[0]}`}
          src={getRenderUrl(imageUrls[0])}
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
            WebkitBackfaceVisibility: 'hidden'
          }}
          draggable={false}
        />
      )}
      {/* Only render slideshow when ALL images are ready */}
      {isReady && prevIndex !== index && (
        <motion.img
          key={`leave-${imageUrls[prevIndex]}-${direction}`}
          src={getRenderUrl(imageUrls[prevIndex])}
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
            WebkitPerspective: 1000
          }}
          draggable={false}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.endsWith('.jpg')) target.src = target.src.replace('.jpg', '.png');
          }}
        />
      )}
      {/* Entering (current) image */}
      {isReady && (
        <motion.img
          key={`enter-${imageUrls[index]}-${direction}`}
          src={getRenderUrl(imageUrls[index])}
          alt="home slide"
          initial={{ x: direction === 'forward' ? '100%' : '-100%', opacity: 1 }}
          animate={{ x: 0 }}
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
            WebkitPerspective: 1000
          }}
          draggable={false}
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.endsWith('.jpg')) target.src = target.src.replace('.jpg', '.png');
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
            className="home-slide__control home-slide__control--prev"
            disabled={isSliding}
          >
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={goNext}
            className="home-slide__control home-slide__control--next"
            disabled={isSliding}
          >
            <svg className="home-slide__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
            </svg>
          </button>
        </>
      )}

      {/* Bubbles removed as requested */}
    </div>
  );
};

export default HomeSlideshow;


