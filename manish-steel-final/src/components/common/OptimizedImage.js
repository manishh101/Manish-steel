import React, { useState, useRef, useEffect } from 'react';
import { FaImage } from 'react-icons/fa';
import ImageService from '../../services/imageService';

const OptimizedImage = ({ 
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
  ...props
}) => {
  const [imageState, setImageState] = useState({
    loaded: false,
    error: false,
    currentSrc: null
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
    tall: 'aspect-[3/4]'
  };

  // Get optimized image source - prioritize Cloudinary URLs
  const getOptimizedSrc = () => {
    // No src provided - use Cloudinary placeholder
    if (!src) {
      console.warn('Missing image source, using Cloudinary placeholder for category:', category);
      return ImageService.getCloudinaryPlaceholder(category);
    }
    
    // Use ImageService to get the optimized URL
    const optimizedUrl = ImageService.getOptimizedImageUrl(src, {
      ...sizeConfig[size],
      category
    });
    
    console.log('Production-ready optimized URL:', optimizedUrl);
    return optimizedUrl;
  };

  // Get fallback source - use Cloudinary placeholder for production
  const getFallbackSrc = () => {
    console.warn('Image failed to load, using Cloudinary placeholder for category:', category);
    return ImageService.getCloudinaryPlaceholder(category);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) {
      setImageState(prev => ({ ...prev, currentSrc: getOptimizedSrc() }));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setImageState(prev => ({ ...prev, currentSrc: getOptimizedSrc() }));
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
  }, [src, size, lazy, category]);

  const handleLoad = (e) => {
    setImageState(prev => ({ ...prev, loaded: true }));
    onLoad?.(e);
  };

  const handleError = (e) => {
    const failedSrc = imageState.currentSrc;
    console.warn('Image failed to load:', failedSrc);
    
    // Check if this was already a placeholder - if so, don't try to load another placeholder
    const wasAlreadyPlaceholder = failedSrc && (
      failedSrc.includes('/placeholders/') ||
      failedSrc.includes('sample.jpg') ||
      failedSrc.includes('l_text:') // Cloudinary text overlay placeholder
    );
    
    if (wasAlreadyPlaceholder) {
      console.error('Even placeholder image failed to load:', failedSrc);
      // Just mark as loaded with error to avoid infinite error loop
      setImageState(prev => ({ 
        ...prev, 
        error: true,
        loaded: true
      }));
    } else {
      // Try the fallback (placeholder) instead
      const fallbackSrc = getFallbackSrc();
      console.log('Using fallback image:', fallbackSrc);
      setImageState(prev => ({ 
        ...prev, 
        error: false, // Reset error since we're trying a new image
        currentSrc: fallbackSrc,
        loaded: false // Reset loaded to show loading state for placeholder
      }));
    }
    
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
      {/* Loading placeholder - with smoother transition */}
      {!imageState.loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 transition-opacity duration-500">
          <FaImage className="w-8 h-8 text-gray-300" />
        </div>
      )}

      {/* Main image */}
      {imageState.currentSrc && imageState.currentSrc.trim() !== '' && (
        <img
          src={imageState.currentSrc}
          srcSet={lazy ? undefined : ImageService.generateSrcSet(src, { category })}
          sizes={lazy ? undefined : ImageService.getImageSizes()}
          alt={alt || ImageService.getImageAlt({ name: alt, category })}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-all duration-700 ease-in-out
            ${imageState.loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          `}
          {...props}
        />
      )}

      {/* Error state indicator - Hidden for better UX */}
      {/* Removed fallback indicator to provide cleaner gallery experience */}
    </div>
  );
};

export default OptimizedImage;
