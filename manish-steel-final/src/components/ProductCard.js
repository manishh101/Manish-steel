import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaImages } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollUtils';
import ImageService from '../services/imageService';
import OptimizedImage from './common/OptimizedImage';

const ProductCard = ({ 
  product, 
  onQuickView, 
  onProductView,
  onProductLike,
  showCategory = true, 
  withActions = true,
  variant = 'standard', // 'standard', 'featured', 'bestseller', 'gallery'
  rank = null, // For bestseller variant
  salesCount = null, // For bestseller variant
  className = ''
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle image loading - Hooks must be called before any early returns
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Safety check for product data
  if (!product) {
    console.warn('ProductCard: No product data provided');
    return null;
  }

  // Get the main product image - prioritize Cloudinary URLs
  const getMainProductImage = () => {
    // Priority order for finding the main image:
    // 1. product.src (often the optimized main image)
    // 2. product.image 
    // 3. first image from product.images array
    // 4. fallback placeholder
    
    const potentialImages = [
      product.src,
      product.image,
      product.images?.[0],
      product.thumbnail,
      product.mainImage
    ].filter(Boolean);

    // Find the first valid image URL
    for (const img of potentialImages) {
      if (typeof img === 'string' && img.trim()) {
        return img.trim();
      } else if (typeof img === 'object' && (img.url || img.src)) {
        return img.url || img.src;
      }
    }
    
    // Return null to let OptimizedImage handle the fallback
    return null;
  };

  // Ensure required product properties exist
  const safeProduct = {
    _id: product._id || product.id || 'unknown',
    id: product.id || product._id || 'unknown',
    name: product.name || product.title || 'Unnamed Product',
    image: getMainProductImage(),
    category: product.category || 'Furniture',
    description: product.description || '',
    inStock: product.inStock !== undefined ? product.inStock : true,
    isNew: product.isNew || false,
    discount: product.discount || null,
    featured: product.featured || false,
    salesCount: product.salesCount || salesCount || null,
    ...product // Spread original product to keep any additional properties
  };

  // Handle product link click with scroll to top
  const handleProductClick = (e) => {
    e.preventDefault();
    if (onProductView) {
      // For gallery variant, pass the full product object instead of just ID
      if (variant === 'gallery') {
        onProductView(safeProduct);
      } else {
        onProductView(safeProduct._id || safeProduct.id);
      }
    } else {
      navigate(`/products/${safeProduct._id || safeProduct.id}`);
      scrollToTop({ instant: true });
    }
  };

  // Get variant-specific classes and configurations
  const getVariantConfig = () => {
    switch (variant) {
      case 'featured':
        return {
          cardClass: 'hover:shadow-lg hover:-translate-y-1',
          buttonClass: 'bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary/80 transition-colors flex items-center gap-1.5 text-xs',
          buttonText: 'View Details'
        };
      case 'bestseller':
        return {
          cardClass: 'hover:shadow-lg hover:-translate-y-2 border-2 border-transparent hover:border-orange-200',
          buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold transform hover:scale-105',
          buttonText: 'View Details'
        };
      case 'gallery':
        return {
          cardClass: 'hover:shadow-lg hover:border-primary/20 cursor-pointer',
          simpleLayout: true
        };
      default:
        return {
          cardClass: 'hover:shadow-lg',
          buttonClass: 'text-gray-500 font-medium hover:text-primary/80 flex items-center group text-xs',
          buttonText: 'View Details'
        };
    }
  };

  const config = getVariantConfig();

  return (
    <div className={`product-card bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 border border-gray-100 group h-full flex flex-col ${config.cardClass} ${className}`}>
      {/* Image container - much larger like reference */}
      <div className="relative w-full overflow-hidden bg-gray-100" style={{aspectRatio: '4/5'}}>
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}

        <Link to={`/products/${safeProduct._id || safeProduct.id}`} onClick={handleProductClick} className="block w-full h-full">
          <OptimizedImage
            src={safeProduct.image}
            alt={ImageService.getImageAlt(safeProduct)}
            category={safeProduct.category}
            size="medium"
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            lazy={true}
            priority={variant === 'featured' ? 'true' : undefined}
          />
        </Link>
        
        {/* Variant badges - positioned in top-right corner */}
        {variant === 'featured' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-yellow-100/95 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
              ⭐ Featured Product
            </span>
          </div>
        )}
        
        {variant === 'bestseller' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-orange-100/95 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
              🔥 Best Seller
            </span>
          </div>
        )}
        
        {/* Additional bestseller sales count badge */}
        {variant === 'bestseller' && salesCount && (
          <div className="absolute top-12 right-3 z-10">
            <span className="inline-flex items-center gap-1 bg-green-100/95 text-green-800 px-2 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm">
              {salesCount}+ sold
            </span>
          </div>
        )}
        
        {/* Quick view overlay */}
        {withActions && !config.simpleLayout && onQuickView && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <div className="space-y-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Quick view clicked for:', safeProduct.name);
                  onQuickView(safeProduct);
                }}
                className="bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-lg font-medium transition-colors w-full"
              >
                Quick View
              </button>
              <Link
                to={`/products/${safeProduct._id || safeProduct.id}`}
                onClick={handleProductClick}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 shadow-lg font-medium transition-colors text-center block"
              >
                View Details
              </Link>
            </div>
          </div>
        )}

        {/* Gallery overlay */}
        {config.simpleLayout && (
          <div 
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
            onClick={handleProductClick}
          >
            <div className="text-white text-center pointer-events-none transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/30">
                <FaImages className="mx-auto mb-1 text-lg" />
                <span className="font-medium text-sm">View Images</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Product info */}
      {config.simpleLayout ? (
        /* Simple layout for gallery */
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 line-clamp-2 leading-tight">
            {safeProduct.name}
          </h4>
          {safeProduct.category && (
            <p className="text-sm text-gray-500 mt-1">
              {safeProduct.category}
            </p>
          )}
        </div>
      ) : (
        /* Full layout - compact text area like reference */
        <div className="p-3 flex-1 flex flex-col justify-between"
             style={{minHeight: '80px'}}>
          {showCategory && !config.hideCategory && (
            <div style={{marginBottom: '1px'}}>
              <span className="text-xs text-gray-400 uppercase tracking-wide font-light" style={{fontSize: '9px'}}>
                {safeProduct.subcategory || 
                 safeProduct.productType ||
                 (safeProduct.name?.includes('Wardrobe') ? 'Wardrobe' :
                  safeProduct.name?.includes('Almirah') ? 'Almirah' :
                  safeProduct.name?.includes('Table') ? 'Table' :
                  safeProduct.name?.includes('Chair') ? 'Chair' :
                  safeProduct.name?.includes('Bed') ? 'Bed' :
                  safeProduct.name?.includes('Door') ? 'Door' :
                  'Steel Furniture')}
              </span>
            </div>
          )}
          
          <Link to={`/products/${safeProduct._id || safeProduct.id}`} onClick={handleProductClick} className="block">
            <h3 className="text-sm font-medium text-gray-800 hover:text-primary transition-colors line-clamp-2 leading-tight" style={{marginBottom: '2px'}}>
              {safeProduct.name || safeProduct.title}
            </h3>
          </Link>

          {safeProduct.description && (variant === 'featured' || variant === 'bestseller') && (
            <p className="text-gray-600 text-sm line-clamp-2" style={{marginBottom: '4px'}}>
              {safeProduct.description}
            </p>
          )}

          {/* Button container - pushed to bottom */}
          <div className="mt-auto">
            {/* Standard variant button */}
            {variant === 'standard' && (
              <button 
                onClick={handleProductClick}
                className={config.buttonClass}
              >
                {config.buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

              {/* Featured variant button */}
            {variant === 'featured' && (
              <button 
                onClick={handleProductClick}
                className={config.buttonClass}
              >
                {config.buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}

            {/* Bestseller variant button */}
            {variant === 'bestseller' && (
              <button 
                onClick={handleProductClick}
                className={config.buttonClass}
              >
                {config.buttonText}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
