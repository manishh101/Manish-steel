import React, { useState, useEffect, useCallback, useRef } from 'react';
import './ProfessionalGalleryModal.css';
import ImageService from '../services/imageService';
import OptimizedImage from './common/OptimizedImage';
import { motion, AnimatePresence } from 'framer-motion';

const ProfessionalGalleryModal = ({ 
  isOpen, 
  onClose, 
  images = [], 
  initialIndex = 0, 
  productName = 'Product Gallery' 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoadErrors, setImageLoadErrors] = useState(new Set());
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [processedImages, setProcessedImages] = useState([]);
  const [slideDirection, setSlideDirection] = useState(0); // -1 for left, 1 for right, 0 for initial
  const thumbnailsContainerRef = useRef(null);
  
  // Touch gesture handling
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50; // Minimum distance in pixels to recognize as swipe
  
  // Process images when they change - simplified to work with OptimizedImage component
  useEffect(() => {
    console.log('ProfessionalGalleryModal received images:', images);
    
    if (Array.isArray(images) && images.length > 0) {
      console.log('Raw image data examples:', 
                 images.slice(0, 3).map(img => typeof img === 'object' ? JSON.stringify(img) : img));
      
      // Extract raw URLs and let OptimizedImage handle the Cloudinary optimization
      const rawUrls = images.map(img => {
        if (!img) return null;
        
        if (typeof img === 'string') {
          return img; // Return raw URL
        } else if (typeof img === 'object') {
          // Extract the URL from object
          return img.url || img.src || img.path || img.image || img.imageUrl || img.secure_url || '';
        }
        return null;
      }).filter(Boolean); // Remove null/undefined entries
      
      console.log('Raw URLs for OptimizedImage:', rawUrls.slice(0, 3));
      
      // Set raw URLs - OptimizedImage will handle optimization
      setProcessedImages(rawUrls);
      console.log('Image processing complete:', rawUrls.length);
    } else {
      setProcessedImages([]);
      console.log('Gallery modal: No valid images provided');
    }
  }, [images]);
  
  // Reset state when modal opens/closes or images change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageLoadErrors(new Set());
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigatePrevious();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
        case 'Home':
          setCurrentIndex(0);
          break;
        case 'End':
          setCurrentIndex(processedImages.length - 1);
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isOpen, processedImages.length, onClose]);

  // Add preload image function for error retry
  const preloadImage = useCallback((index) => {
    if (processedImages[index]) {
      setIsLoading(true);
      setImageLoadErrors(prev => {
        const newErrors = new Set(prev);
        newErrors.delete(index);
        return newErrors;
      });
      
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        handleImageError(index);
        setIsLoading(false);
      };
      img.src = processedImages[index];
    }
  }, [processedImages]);

  const navigateNext = useCallback(() => {
    if (processedImages.length <= 1) return;
    
    setSlideDirection(1); // Right direction
    setCurrentIndex((prev) => (prev + 1) % processedImages.length);
    setIsLoading(true);
    
    // Scroll to the new thumbnail
    if (thumbnailsContainerRef.current) {
      const nextIndex = (currentIndex + 1) % processedImages.length;
      scrollToThumbnail(nextIndex);
    }
  }, [processedImages.length, currentIndex]);

  const navigatePrevious = useCallback(() => {
    if (processedImages.length <= 1) return;
    
    setSlideDirection(-1); // Left direction
    setCurrentIndex((prev) => (prev - 1 + processedImages.length) % processedImages.length);
    setIsLoading(true);
    
    // Scroll to the new thumbnail
    if (thumbnailsContainerRef.current) {
      const prevIndex = (currentIndex - 1 + processedImages.length) % processedImages.length;
      scrollToThumbnail(prevIndex);
    }
  }, [processedImages.length, currentIndex]);
  
  // Function to scroll thumbnails container to make current thumbnail visible
  const scrollToThumbnail = (index) => {
    if (thumbnailsContainerRef.current) {
      const container = thumbnailsContainerRef.current;
      const thumbnails = container.querySelectorAll('.thumbnail-item');
      
      if (thumbnails[index]) {
        const thumbnail = thumbnails[index];
        const containerWidth = container.offsetWidth;
        const thumbnailWidth = thumbnail.offsetWidth;
        const thumbnailLeft = thumbnail.offsetLeft;
        
        // Calculate center position
        const targetScrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    // Scroll to the current thumbnail when image is loaded
    if (thumbnailsContainerRef.current) {
      scrollToThumbnail(currentIndex);
    }
  };

  const handleImageError = (index) => {
    console.error(`Failed to load image at index ${index}`);
    setImageLoadErrors(prev => new Set(prev).add(index));
    setIsLoading(false);
  };
  
  // Touch event handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left -> next image
      navigateNext();
    } else if (isRightSwipe) {
      // Swipe right -> previous image
      navigatePrevious();
    }
    
    // Reset values
    touchStartX.current = null;
    touchEndX.current = null;
  };
  
  // Handle mouse wheel for navigation
  const handleMouseWheel = useCallback((e) => {
    // Prevent default to avoid page scrolling
    e.preventDefault();
    
    // Determine direction based on delta
    if (e.deltaX > 30 || e.deltaY > 30) {
      navigateNext();
    } else if (e.deltaX < -30 || e.deltaY < -30) {
      navigatePrevious();
    }
  }, [navigateNext, navigatePrevious]);

  // Handle thumbnail click with improved error handling
  const handleThumbnailClick = (index) => {
    if (currentIndex !== index) {
      setCurrentIndex(index);
      setIsLoading(true);
    }
  };

  if (!isOpen || processedImages.length === 0) return null;

  const currentImageUrl = processedImages[currentIndex] || '';
  const hasError = imageLoadErrors.has(currentIndex);

  return (
    <div className="professional-gallery-modal" onClick={onClose}>
      <div className="gallery-modal-content" 
           onClick={(e) => e.stopPropagation()} 
           onTouchStart={handleTouchStart} 
           onTouchMove={handleTouchMove} 
           onTouchEnd={handleTouchEnd}>
        
        {/* Enhanced Header with better styling */}
        <motion.div 
          className="gallery-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="gallery-title">
            <h2>{productName}</h2>
            <span className="image-counter">
              {currentIndex + 1} / {processedImages.length}
            </span>
          </div>
          <div className="gallery-controls">
            <button 
              className="control-btn thumbnail-toggle"
              onClick={() => setShowThumbnails(!showThumbnails)}
              title={`${showThumbnails ? 'Hide' : 'Show'} thumbnails`}
              aria-label={`${showThumbnails ? 'Hide' : 'Show'} thumbnails`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
              </svg>
            </button>
            <button 
              className="control-btn close-btn" 
              onClick={onClose}
              title="Close gallery (ESC)"
              aria-label="Close gallery"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Main Image Display with Sliding Animation */}
        <div 
          className="gallery-main-image"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="slider-container">
            <AnimatePresence initial={false} custom={slideDirection} mode="wait">
              <motion.div
                key={currentIndex}
                custom={slideDirection}
                initial={{ 
                  opacity: 0,
                  x: slideDirection > 0 ? '100%' : slideDirection < 0 ? '-100%' : 0,
                  scale: 0.95
                }}
                animate={{ 
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: { 
                    duration: 0.4, 
                    ease: [0.25, 0.8, 0.25, 1],
                    scale: { duration: 0.3 }
                  }
                }}
                exit={{ 
                  opacity: 0,
                  x: slideDirection > 0 ? '-100%' : slideDirection < 0 ? '100%' : 0,
                  scale: 0.95,
                  transition: { 
                    duration: 0.3, 
                    ease: [0.25, 0.8, 0.25, 1] 
                  }
                }}
                className="image-slide active"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              >
                {isLoading && (
                  <motion.div 
                    className="image-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="loading-spinner"></div>
                    <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.8)' }}>Loading image...</p>
                  </motion.div>
                )}
                
                {hasError ? (
                  <motion.div 
                    className="image-error"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <svg className="image-error-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <p>Unable to load this image</p>
                    <button 
                      onClick={() => preloadImage(currentIndex)} 
                      style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        background: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '6px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <OptimizedImage
                    src={currentImageUrl}
                    alt={`${productName} - Image ${currentIndex + 1}`}
                    onLoad={handleImageLoad}
                    onError={() => handleImageError(currentIndex)}
                    className="main-image"
                    size="large"
                    category={productName}
                    lazy={false}
                    style={{ 
                      maxHeight: '85vh',
                      maxWidth: '95vw',
                      objectFit: 'contain'
                    }}
                    priority={true}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Enhanced Navigation buttons with better styling */}
          {processedImages.length > 1 && (
            <>
              <button 
                className="nav-arrow prev" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrevious();
                }}
                title="Previous image"
                aria-label="Previous image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                </svg>
              </button>
              <button 
                className="nav-arrow next" 
                onClick={(e) => {
                  e.stopPropagation();
                  navigateNext();
                }}
                title="Next image"
                aria-label="Next image"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </button>
            </>
          )}
        </div>
        
        {/* Enhanced Thumbnails with animation */}
        {showThumbnails && processedImages.length > 1 && (
          <motion.div 
            className="gallery-thumbnails"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div 
              className="thumbnails-container"
              ref={thumbnailsContainerRef}
            >
              {processedImages.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail-item ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <OptimizedImage
                    src={image}
                    alt={`Thumbnail ${index + 1}`} 
                    className="thumbnail"
                    size="thumbnail"
                    category={productName}
                    lazy={false}
                  />
                  {index === currentIndex && (
                    <div className="thumbnail-active-indicator"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Thumbnail navigation buttons if many thumbnails */}
            {processedImages.length > 6 && (
              <>
                <button 
                  className="prev-thumbnails" 
                  onClick={() => {
                    if (thumbnailsContainerRef.current) {
                      thumbnailsContainerRef.current.scrollBy({
                        left: -200,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                  </svg>
                </button>
                <button 
                  className="next-thumbnails" 
                  onClick={() => {
                    if (thumbnailsContainerRef.current) {
                      thumbnailsContainerRef.current.scrollBy({
                        left: 200,
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalGalleryModal;
