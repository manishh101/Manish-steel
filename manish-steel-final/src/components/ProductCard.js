import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaHeart, FaStar, FaArrowRight, FaFire, FaTrophy, FaShoppingCart } from 'react-icons/fa';
import { scrollToTop } from '../utils/scrollUtils';
import ImageService from '../services/imageService';
import OptimizedImage from './common/OptimizedImage';

const ProductCard = ({ 
  product, 
  onQuickView, 
  onProductView,
  onProductLike,
  showBadges = true, 
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

  // Safety check for product data
  if (!product) {
    console.warn('ProductCard: No product data provided');
    return null;
  }

  // Ensure required product properties exist
  const safeProduct = {
    _id: product._id || product.id || 'unknown',
    id: product.id || product._id || 'unknown',
    name: product.name || 'Unnamed Product',
    price: product.price || 0,
    image: product.image || product.images?.[0] || '/images/furniture-placeholder.jpg',
    category: product.category || 'Furniture',
    description: product.description || '',
    rating: product.rating || 4.5,
    inStock: product.inStock !== undefined ? product.inStock : true,
    isNew: product.isNew || false,
    discount: product.discount || null,
    featured: product.featured || false,
    salesCount: product.salesCount || salesCount || null,
    ...product // Spread original product to keep any additional properties
  };

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Handle product link click with scroll to top
  const handleProductClick = (e) => {
    e.preventDefault();
    if (onProductView) {
      onProductView(safeProduct._id || safeProduct.id);
    } else {
      navigate(`/products/${safeProduct._id || safeProduct.id}`);
      scrollToTop({ instant: true });
    }
  };

  // Format price with currency
  const formatPrice = useCallback((price) => {
    if (!price || price === 0) return 'Price on request';
    return `₹${parseFloat(price).toLocaleString()}`;
  }, []);

  // Format sales count for bestseller variant
  const formatSalesCount = useCallback((count) => {
    if (!count) return salesCount || '100+';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  }, [salesCount]);

  // Get badge configuration for bestseller variant
  const getBadgeForRank = useCallback((index) => {
    const badges = [
      { text: '#1 Best Seller', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: FaTrophy },
      { text: '#2 Hot Pick', color: 'bg-gradient-to-r from-orange-400 to-red-500', icon: FaFire },
      { text: '#3 Popular', color: 'bg-gradient-to-r from-red-400 to-pink-500', icon: FaShoppingCart },
      { text: 'Best Seller', color: 'bg-gradient-to-r from-blue-400 to-purple-500', icon: FaShoppingCart },
      { text: 'Hot Item', color: 'bg-gradient-to-r from-green-400 to-blue-500', icon: FaFire },
      { text: 'Popular', color: 'bg-gradient-to-r from-purple-400 to-pink-500', icon: FaShoppingCart }
    ];
    return badges[index] || badges[3];
  }, []);

  // Render star rating
  const renderRating = useCallback((rating = 4.5) => {
    return (
      <div className="flex items-center gap-1" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`h-3 w-3 ${
              index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  }, []);

  // Get variant-specific classes and configurations
  const getVariantConfig = () => {
    switch (variant) {
      case 'featured':
        return {
          cardClass: 'hover:shadow-xl hover:-translate-y-1',
          badgeConfig: { text: '⭐ Featured', color: 'bg-yellow-400 text-yellow-900' },
          buttonClass: 'bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors flex items-center gap-2 text-sm',
          buttonText: 'View Details'
        };
      case 'bestseller':
        return {
          cardClass: 'hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-orange-200',
          badgeConfig: rank !== null ? getBadgeForRank(rank) : getBadgeForRank(0),
          buttonClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center gap-2 text-sm font-semibold transform hover:scale-105',
          buttonText: 'Buy Now',
          showSalesCount: true,
          showHotIndicator: true
        };
      case 'gallery':
        return {
          cardClass: 'hover:shadow-lg hover:border-primary/20 cursor-pointer',
          hidePrice: true,
          hideRating: true,
          simpleLayout: true
        };
      default:
        return {
          cardClass: 'hover:shadow-xl',
          buttonClass: 'text-primary font-medium hover:text-primary/80 flex items-center group',
          buttonText: 'View Details'
        };
    }
  };

  const config = getVariantConfig();
  const badge = config.badgeConfig;
  const BadgeIcon = badge?.icon;

  return (
    <div className={`product-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 group ${config.cardClass} ${className}`}>
      {/* Image container */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
          </div>
        )}

        <Link to={`/products/${safeProduct._id || safeProduct.id}`} onClick={handleProductClick} className="block w-full h-full">
          <OptimizedImage
            src={imageError ? '/images/furniture-placeholder.jpg' : safeProduct.image}
            alt={ImageService.getImageAlt(safeProduct)}
            category={safeProduct.category}
            size="medium"
            className={`w-full h-full transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            lazy={true}
          />
        </Link>
        
        {/* Quick view overlay */}
        {withActions && !config.simpleLayout && onQuickView && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(safeProduct);
              }}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-50 shadow-lg font-medium"
            >
              <FaEye className="inline mr-2" />
              Quick View
            </button>
          </div>
        )}

        {/* Gallery overlay */}
        {config.simpleLayout && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <FaEye className="w-8 h-8 mx-auto mb-2" />
              <span className="font-medium">View Images</span>
            </div>
          </div>
        )}
        
        {/* Badges - Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* Variant specific badge */}
          {badge && (
            <span className={`${badge.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
              {BadgeIcon && <BadgeIcon className="h-3 w-3" />}
              {badge.text}
            </span>
          )}

          {/* Standard badges */}
          {showBadges && !config.simpleLayout && (
            <>
              {safeProduct.inStock ? (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  In Stock
                </span>
              ) : (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  Out of Stock
                </span>
              )}
              
              {safeProduct.isNew && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  New
                </span>
              )}

              {safeProduct.discount && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                  {safeProduct.discount}% Off
                </span>
              )}
            </>
          )}

          {/* Category badge for gallery */}
          {config.simpleLayout && (safeProduct.category || safeProduct.description) && (
            <span className="inline-block px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              {safeProduct.category || safeProduct.description}
            </span>
          )}
        </div>

        {/* Top Right badges/info */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {/* Sales count for bestseller */}
          {config.showSalesCount && (
            <div className="bg-white/95 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <FaShoppingCart className="h-3 w-3" />
              {formatSalesCount(safeProduct.salesCount)} sold
            </div>
          )}

          {/* Wishlist button */}
          {withActions && !config.simpleLayout && (
            <button 
              title="Add to Wishlist"
              onClick={(e) => {
                e.preventDefault();
                onProductLike?.(safeProduct);
              }}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
              aria-label="Add to wishlist"
            >
              <FaHeart className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hot indicator for bestseller */}
        {config.showHotIndicator && (
          <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            🔥 HOT
          </div>
        )}
      </div>
      
      {/* Product info */}
      {config.simpleLayout ? (
        /* Simple layout for gallery */
        <div className="p-4">
          <h4 className="font-semibold text-gray-900 truncate">
            {safeProduct.title || safeProduct.name || 'Product'}
          </h4>
        </div>
      ) : (
        /* Full layout for other variants */
        <div className="p-4 sm:p-6">
          {showCategory && safeProduct.category && !config.hideCategory && (
            <div className="mb-1">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                {safeProduct.subcategory || safeProduct.category}
              </span>
            </div>
          )}
          
          <Link to={`/products/${safeProduct._id || safeProduct.id}`} onClick={handleProductClick} className="block">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800 hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight">
              {safeProduct.name || safeProduct.title}
            </h3>
          </Link>

          {safeProduct.description && variant === 'featured' && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {safeProduct.description}
            </p>
          )}

          {/* Rating */}
          {!config.hideRating && (safeProduct.rating || variant === 'featured' || variant === 'bestseller') && (
            <div className="mb-3">
              {renderRating(safeProduct.rating)}
              {variant === 'bestseller' && (
                <p className="text-xs text-gray-500 mt-1">
                  Based on {safeProduct.reviewCount || '50+'} customer reviews
                </p>
              )}
            </div>
          )}

          {/* Price and Action */}
          {!config.hidePrice && (
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-primary font-bold text-lg sm:text-xl">
                  {formatPrice(safeProduct.price)}
                </span>
                
                {(safeProduct.oldPrice || safeProduct.originalPrice) && (
                  <span className="text-gray-500 line-through text-sm ml-2">
                    {formatPrice(safeProduct.oldPrice || safeProduct.originalPrice)}
                  </span>
                )}
              </div>
              
              {(variant === 'featured' || variant === 'bestseller') && (
                <Link
                  to={`/products/${safeProduct._id || safeProduct.id}`}
                  className={config.buttonClass}
                >
                  {config.buttonText}
                  <FaArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}

          {/* Standard variant button */}
          {variant === 'standard' && (
            <button 
              onClick={handleProductClick}
              className={config.buttonClass}
            >
              {config.buttonText}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          {/* Stock status for bestseller */}
          {variant === 'bestseller' && (
            <div className="mt-3 text-center">
              {safeProduct.stock && safeProduct.stock < 10 ? (
                <span className="text-red-600 text-xs font-semibold">
                  ⚠️ Only {safeProduct.stock} left in stock!
                </span>
              ) : (
                <span className="text-green-600 text-xs font-semibold">
                  ✅ In Stock
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
