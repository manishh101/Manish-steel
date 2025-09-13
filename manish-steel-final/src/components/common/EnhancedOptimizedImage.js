import React, { useState, useRef, useEffect } from 'react';
import { FaImage, FaExclamationTriangle } from 'react-icons/fa';
import ImageService from '../../services/imageService';
import CloudinaryImageService from '../../services/cloudinaryImageService';
import ImageAvailabilityService from '../../services/imageAvailabilityService';

/**
 * Enhanced OptimizedImage component with robust error handling and fallbacks
 */
const EnhancedOptimizedImage = ({ 
  src,
  alt,
  className = '',
  style = {},
  size = 'medium',
  category = '',
  lazy = true,
  aspectRatio = 'square',
  onLoad,
  onError,
  showFallbackIndicator = true,
  enableAvailabilityCheck = false,
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    currentSrc: null,
    attemptedUrls: [],
    usingFallback: false
  });
  const imgRef = useRef(null);
  const [isInView, setIsInView] = useState(!lazy);

  const sizeConfig = {
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
    thumbnail: { width: 150, height: 150 }
  };

  const aspectRatioClasses = {
    square: 'aspect-square',
    wide: 'aspect-video',
    tall: 'aspect-[3/4]',
    auto: ''
  };

  // Get all possible image sources in priority order
  const getImageSources = () => {
    const sources = [];
    
    if (!src) {
      return [ImageService.getPlaceholderImage(category)];
    }

    // Primary source - optimized version
    const primaryUrl = ImageService.getOptimizedImageUrl(src, {
      ...sizeConfig[size],
      category
    });
    sources.push(primaryUrl);

    // If it's a Cloudinary URL, try different optimization levels
    if (CloudinaryImageService.isCloudinaryUrl(src)) {
      // Try with different quality settings
      const qualityVariants = ['auto:good', 'auto:low', '80'];
      qualityVariants.forEach(quality => {
        const variant = CloudinaryImageService.optimizeCloudinaryUrl(src, {
          ...sizeConfig[size],
          quality
        });
        if (variant !== primaryUrl && !sources.includes(variant)) {
          sources.push(variant);
        }
      });
    }

    // Original source as fallback
    if (src !== primaryUrl && !sources.includes(src)) {
      sources.push(src);
    }

    // Final fallback - placeholder
    const placeholder = ImageService.getPlaceholderImage(category);
    if (!sources.includes(placeholder)) {
      sources.push(placeholder);
    }

    return sources;
  };

  // Try loading the next available image source
  const tryNextImageSource = async () => {
    const sources = getImageSources();
    const { attemptedUrls } = imageState;

    // Find the next URL to try
    const nextUrl = sources.find(url => !attemptedUrls.includes(url));
    
    if (!nextUrl) {
      console.error('All image sources failed for:', src);
      setImageState(prev => ({ 
        ...prev, 
        error: true,
        loaded: true,
        usingFallback: true
      }));
      return;
    }

    // Check availability if enabled
    if (enableAvailabilityCheck) {
      const isAvailable = await ImageAvailabilityService.checkImageAvailability(nextUrl);
      if (!isAvailable) {
        setImageState(prev => ({ 
          ...prev, 
          attemptedUrls: [...prev.attemptedUrls, nextUrl]
        }));
        // Try the next one
        setTimeout(tryNextImageSource, 0);
        return;
      }
    }

    // Try loading this URL
    const isPlaceholder = ImageService.isPlaceholder(nextUrl);
    setImageState(prev => ({ 
      ...prev, 
      currentSrc: nextUrl,
      attemptedUrls: [...prev.attemptedUrls, nextUrl],
      usingFallback: isPlaceholder
    }));
  };

  // Initialize image loading
  useEffect(() => {
    if (!isInView) return;

    setImageState({
      loaded: false,
      error: false,
      currentSrc: null,
      attemptedUrls: [],
      usingFallback: false
    });

    tryNextImageSource();
  }, [src, size, category, isInView]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy]);

  const handleLoad = (e) => {
    setImageState(prev => ({ ...prev, loaded: true }));
    onLoad?.(e);
  };

  const handleError = (e) => {
    console.warn('Image failed to load:', imageState.currentSrc);
    
    // Mark this URL as failed and try the next one
    setImageState(prev => ({ ...prev, error: true }));
    
    // Try the next source after a short delay
    setTimeout(tryNextImageSource, 100);
    
    onError?.(e);
  };

  const combinedClassName = `
    relative overflow-hidden bg-gray-100
    ${aspectRatioClasses[aspectRatio] || 'aspect-square'}
    ${className}
  `.trim();

  return (
    <div 
      ref={imgRef}
      className={combinedClassName}
      style={style}
    >
      {/* Loading placeholder */}
      {!imageState.loaded && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <FaImage className="w-8 h-8 text-gray-400" />
          <span className="sr-only">Loading image...</span>
        </div>
      )}

      {/* Lazy loading placeholder */}
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <FaImage className="w-6 h-6 text-gray-300" />
        </div>
      )}

      {/* Main image */}
      {imageState.currentSrc && isInView && (
        <img
          src={imageState.currentSrc}
          srcSet={lazy ? undefined : ImageService.generateSrcSet(src, { category })}
          sizes={lazy ? undefined : ImageService.getImageSizes()}
          alt={alt || ImageService.getImageAlt({ name: alt, category })}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${imageState.loaded ? 'opacity-100' : 'opacity-0'}
          `}
          {...props}
        />
      )}

      {/* Fallback indicator */}
      {showFallbackIndicator && imageState.usingFallback && imageState.loaded && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-xs flex items-center gap-1">
          <FaExclamationTriangle className="w-3 h-3" />
          <span>Placeholder</span>
        </div>
      )}

      {/* Error indicator for complete failures */}
      {imageState.error && !imageState.currentSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 text-red-500">
          <div className="text-center">
            <FaExclamationTriangle className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedOptimizedImage;
