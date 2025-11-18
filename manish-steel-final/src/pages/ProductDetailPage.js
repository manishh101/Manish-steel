import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes, FaShare, FaHeart } from 'react-icons/fa';
import { productAPI } from '../services/api';
import { scrollToTop } from '../utils/scrollUtils';
import ImageService from '../services/imageService';
import OptimizedImage from '../components/common/OptimizedImage';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import useQuickView from '../hooks/useQuickView';
import { defaultProductImages } from '../utils/productPlaceholders';
import { defaultProducts } from '../utils/productData';

// Only used as last-resort fallbacks when database images are not available
const defaultImages = defaultProductImages;

/**
 * ProductDetailPage Component
 * 
 * A comprehensive product detail page with the following features:
 * - Image gallery with swipe/keyboard navigation
 * - Full-screen image viewing
 * - Product specifications and information
 * - Related products carousel
 * - WhatsApp integration for inquiries
 * - Responsive design (mobile-first)
 * - Accessible keyboard navigation
 * 
 * @returns {JSX.Element} The product detail page component
 */
const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(false);
  const [touchPosition, setTouchPosition] = useState(null);
  const [fullScreenView, setFullScreenView] = useState(false);
  const imageContainerRef = useRef(null);
  
  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const relatedProductsRef = useRef(null);
  
  // Quick view functionality
  const { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView } = useQuickView();

  // Get all available images with priority on database Cloudinary URLs
  // Enhanced to ensure we can handle exactly 4 images from the database
  const allImages = useMemo(() => {
    let images = [];
    
    // PRIORITY 1: Product images array from database (typically Cloudinary URLs)
    // The database has 4 images per product
    if (product?.images?.length > 0) {
      // Process all available images from the database
      const validImages = product.images
        .filter(img => img && typeof img === 'string')
        .map(img => ImageService.getOptimizedImageUrl(img, {
          category: product.category,
          width: 800,
          height: 800
        }));
      
      if (validImages.length > 0) {
        images = [...validImages];
        // Only log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Using ${validImages.length} database product images`);
        }
      }
    }
    
    // PRIORITY 2: Main product image if not already included in the images array
    if (product?.image && typeof product.image === 'string') {
      const optimizedMainImage = ImageService.getOptimizedImageUrl(product.image, {
        category: product.category,
        width: 800,
        height: 800
      });
      
      // Check if this image is already in the array
      const isDuplicate = images.some(img => {
        // Simple URL comparison might not catch Cloudinary transformations
        // So we normalize URLs for comparison
        const normalizedImg = img.split('?')[0]; // Remove query parameters
        const normalizedMain = optimizedMainImage.split('?')[0];
        return normalizedImg === normalizedMain;
      });
      
      if (!isDuplicate) {
        images.unshift(optimizedMainImage);
        if (process.env.NODE_ENV === 'development') {
          console.log('Added main product image (not a duplicate)');
        }
      }
    }
    
    // Only use placeholders if absolutely needed
    if (images.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('No database images available for product, using placeholder');
      }
      const placeholder = ImageService.getPlaceholderImage(product?.category);
      images.push(placeholder);
    }
    
    // Log the final count of images being used (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`Total product images available: ${images.length}`);
    }
    
    return images;
  }, [product]);
  
  // Debug: Log image loading issues (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      if (allImages.length === 0) {
        console.warn('No images available for product:', product?.id);
      } else {
        console.log('Available images:', allImages.length);
        console.log('Image URLs:', allImages);
      }
    }
  }, [allImages, product?.id]);
  
  // Preload all images when component mounts for smoother experience
  // Enhanced to handle Cloudinary URLs more effectively
  useEffect(() => {
    const preloadImages = async () => {
      if (!allImages || allImages.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('No images to preload');
        }
        return;
      }
      
      try {
        if (process.env.NODE_ENV === 'development') {
          console.log('Preloading product images:', allImages.length);
        }
        
        // Track successfully loaded vs failed images
        const loadStats = { success: 0, failed: 0, total: allImages.length };
        
        const imagePromises = allImages.map(src => {
          return new Promise((resolve) => {
            if (!src) {
              loadStats.failed++;
              resolve(null);
              return;
            }
            
            // Log if this is a Cloudinary URL or placeholder (development only)
            const isCloudinary = ImageService.isCloudinaryUrl(src);
            const isPlaceholder = ImageService.isPlaceholder(src);
            
            if (process.env.NODE_ENV === 'development') {
              console.log(`Preloading: ${isCloudinary ? 'Cloudinary' : isPlaceholder ? 'Placeholder' : 'Other'} image: ${src}`);
            }
            
            const img = new Image();
            
            img.onload = () => {
              loadStats.success++;
              resolve(src);
            };
            
            img.onerror = () => {
              loadStats.failed++;
              if (process.env.NODE_ENV === 'development') {
                console.warn(`Failed to load image: ${src}`);
              }
              // Only try a placeholder if we're not already loading a placeholder
              if (!isPlaceholder && defaultImages.length > 0) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('Using fallback placeholder instead');
                }
                img.src = defaultImages[0];
              }
              resolve(null); // Still resolve to continue the process
            };
            
            img.src = src;
          });
        });

        await Promise.all(imagePromises);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Image preloading complete: ${loadStats.success}/${loadStats.total} loaded successfully`);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error preloading images:', error);
        }
      }
    };

    preloadImages();
  }, [allImages]);
  
  // Add keyboard navigation and scroll management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        // Previous image with left arrow key
        const newIndex = selectedImageIndex > 0 
          ? selectedImageIndex - 1 
          : allImages.length - 1;
        setImageLoading(true);
        setSelectedImageIndex(newIndex);
      } else if (e.key === 'ArrowRight') {
        // Next image with right arrow key
        const newIndex = selectedImageIndex < allImages.length - 1 
          ? selectedImageIndex + 1 
          : 0;
        setImageLoading(true);
        setSelectedImageIndex(newIndex);
      } else if (e.key === 'Escape') {
        // Exit full screen view with Escape key
        if (fullScreenView) {
          setFullScreenView(false);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Use our enhanced utility function to scroll to top when loading a new product
    scrollToTop({ instant: true });
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex, allImages.length, fullScreenView]);
  
  // Add scroll restoration on image change or zoom
  useEffect(() => {
    // Save scroll position before image change
    const scrollPosition = window.scrollY;
    
    // Restore scroll position after image loads
    if (!imageLoading) {
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
  }, [selectedImageIndex, imageLoading]);

  // Handle thumbnail click - enhanced for better performance and UX
  const handleThumbnailClick = (index) => {
    // Make sure the index is valid for our array
    const safeIndex = Math.min(Math.max(0, index), allImages.length - 1);
    
    // Only change if selecting a different image
    if (safeIndex !== selectedImageIndex) {
      // Pre-load image before showing loading state
      const img = new Image();
      img.src = allImages[safeIndex];
      
      // If image is already in cache, don't show loading state
      if (img.complete) {
        setSelectedImageIndex(safeIndex);
      } else {
        setImageLoading(true);
        img.onload = () => {
          setSelectedImageIndex(safeIndex);
          setImageLoading(false);
        };
        img.onerror = () => {
          setSelectedImageIndex(safeIndex);
          setImageLoading(false);
        };
      }
    }
  };
  
  // Navigate to previous image with animation
  const handlePrevImage = () => {
    const newIndex = selectedImageIndex > 0 
      ? selectedImageIndex - 1 
      : allImages.length - 1;
    setImageLoading(true);
    setSelectedImageIndex(newIndex);
  };
  
  // Navigate to next image with animation
  const handleNextImage = () => {
    const newIndex = selectedImageIndex < allImages.length - 1 
      ? selectedImageIndex + 1 
      : 0;
    setImageLoading(true);
    setSelectedImageIndex(newIndex);
  };
  
  // Enhanced image full screen functionality
  const handleImageZoom = () => {
    setFullScreenView(true);
  };

  // Handle full screen close
  const handleFullScreenClose = () => {
    setFullScreenView(false);
  };
  
  const handleMouseMove = () => {
    // Mouse move functionality removed since we're using full screen instead of zoom
    return;
  };
  
  const handleMouseLeave = () => {
    // Mouse leave functionality removed since we're using full screen instead of zoom
    return;
  };
  
  // Handle touch events for better mobile support
  const handleTouchStart = (e) => {
    // Store the initial touch position for swipe detection
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
  };
  
  const handleTouchMove = (e) => {
    // Skip if no initial position is set
    if (!touchPosition) return;
    
    const touch = e.touches[0];
    const diffX = touchPosition.x - touch.clientX;
    const diffY = touchPosition.y - touch.clientY;
    
    // If horizontal swipe is more significant than vertical
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 30) {
      if (diffX > 0) {
        // Swipe left, show next image
        handleNextImage();
      } else {
        // Swipe right, show previous image
        handlePrevImage();
      }
      // Reset touch position after handling swipe
      setTouchPosition(null);
    }
  };
  
  const handleTouchEnd = () => {
    // Clear the touch position
    setTouchPosition(null);
  };

  // Carousel navigation functions for related products
  const getProductsPerView = () => {
    if (window.innerWidth >= 1024) return 4; // lg: 4 products
    if (window.innerWidth >= 768) return 3;  // md: 3 products
    return 2; // sm: 2 products
  };

  const getTotalSlides = () => {
    const productsPerView = getProductsPerView();
    return Math.max(0, Math.ceil(relatedProducts.length - productsPerView) + 1);
  };

  const nextSlide = () => {
    const totalSlides = getTotalSlides();
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
      scrollToSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      scrollToSlide(currentSlide - 1);
    }
  };

  const scrollToSlide = (slideIndex) => {
    if (relatedProductsRef.current) {
      const productsPerView = getProductsPerView();
      const cardWidth = relatedProductsRef.current.children[0]?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollDistance = slideIndex * (cardWidth + gap);
      
      relatedProductsRef.current.scrollTo({
        left: scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  // Handle window resize for responsive carousel
  useEffect(() => {
    const handleResize = () => {
      // Reset to first slide on resize to avoid layout issues
      setCurrentSlide(0);
      if (relatedProductsRef.current) {
        relatedProductsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced function to fetch related products based on category with subcategories
  const fetchRelatedProducts = async (currentProduct) => {
    try {
      setRelatedLoading(true);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Fetching related products for category: ${currentProduct?.category || 'unknown'} (including subcategories)`);
      }
      
      let products = [];
      
      // Strategy 1: Get products from the same category INCLUDING all its subcategories
      if (currentProduct?.category) {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Calling enhanced category API for: ${currentProduct.category}`);
          }
          
          // Use the enhanced getByCategory with includeAllSubcategories flag
          const categoryResponse = await productAPI.getByCategory(currentProduct.category, { 
            limit: 24, // Get more products since we're including subcategories
            includeAllSubcategories: true // This is the key enhancement
          });
          
          if (categoryResponse?.data) {
            // Handle different response structures for category-based fetch
            if (Array.isArray(categoryResponse.data)) {
              products = categoryResponse.data;
            } else if (categoryResponse.data.products) {
              products = categoryResponse.data.products;
            }
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`Enhanced category + subcategories fetch returned ${products.length} products`);
            // Log sample of products to verify category/subcategory inclusion
            if (products.length > 0) {
              console.log('Sample products from category + subcategories:', 
                products.slice(0, 5).map(p => ({
                  name: p.name,
                  category: p.category,
                  subcategory: p.subcategory
                }))
              );
            }
          }
        } catch (categoryError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Enhanced category + subcategories fetch failed:', categoryError.message);
          }
          
          // Fallback: Try the alternative filter method
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log('Trying alternative category filtering method...');
            }
            
            const alternativeResponse = await productAPI.getByCategoryAlternative(currentProduct.category, { 
              limit: 24,
              includeAllSubcategories: true,
              debug: process.env.NODE_ENV === 'development'
            });
            
            if (alternativeResponse?.data) {
              if (Array.isArray(alternativeResponse.data)) {
                products = alternativeResponse.data;
              } else if (alternativeResponse.data.products) {
                products = alternativeResponse.data.products;
              }
              
              if (process.env.NODE_ENV === 'development') {
                console.log(`Alternative category method returned ${products.length} products`);
              }
            }
          } catch (alternativeError) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Alternative category method also failed:', alternativeError.message);
            }
          }
        }
      }
      
      // Strategy 2: If no products found or very few, get general products
      if (products.length < 8) {
        try {
          if (process.env.NODE_ENV === 'development') {
            console.log('Fetching general products as fallback...');
          }
          const generalResponse = await productAPI.getAll(1, 24);
          let allProducts = [];
          
          if (generalResponse?.data) {
            // Handle different response structures for general fetch
            if (Array.isArray(generalResponse.data)) {
              allProducts = generalResponse.data;
            } else if (generalResponse.data.products) {
              allProducts = generalResponse.data.products;
            } else if (generalResponse.data.data) {
              allProducts = generalResponse.data.data;
            }
          }
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`General fetch returned ${allProducts.length} products`);
          }
          
          // If we have category products, supplement them; otherwise use all general products
          if (products.length > 0) {
            // Add non-duplicate products from general fetch
            const currentIds = products.map(p => p._id || p.id);
            const additionalProducts = allProducts.filter(p => 
              !currentIds.includes(p._id || p.id) && 
              (p._id || p.id) !== (currentProduct._id || currentProduct.id)
            );
            products = [...products, ...additionalProducts];
          } else {
            products = allProducts;
          }
        } catch (generalError) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('General products fetch failed:', generalError.message);
          }
        }
      }
      
      // Filter out the current product and ensure we have valid products
      const validProducts = products
        .filter(p => p && (p._id || p.id) && p.name) // Ensure product has required properties
        .filter(p => (p._id || p.id) !== (currentProduct._id || currentProduct.id)) // Remove current product
        .slice(0, 12); // Limit to 12 products for carousel
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`Final related products count: ${validProducts.length}`);
      }
      
      // Strategy 3: If still no products found, use default products as absolute fallback
      if (validProducts.length === 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Using default products as absolute fallback');
        }
        const fallbackProducts = defaultProducts
          .filter(p => p && p.id && p.name) // Ensure valid product structure
          .slice(0, 8); // Take first 8 default products for carousel
        
        // Transform default products to match expected structure
        const transformedProducts = fallbackProducts.map(product => ({
          ...product,
          _id: product.id, // Ensure _id exists for consistency
          image: product.images?.[0] || '/images/furniture-placeholder.jpg',
          category: product.categoryId || 'Furniture',
          inStock: true // Default to in stock
        }));
        
        setRelatedProducts(transformedProducts);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Set ${transformedProducts.length} fallback products`);
        }
      } else {
        setRelatedProducts(validProducts);
      }
      
      // Reset carousel position when new products are loaded
      setCurrentSlide(0);
      
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching related products:', error);
        // Use default products as fallback when everything fails
        console.log('Using default products due to error');
      }
      const fallbackProducts = defaultProducts
        .filter(p => p && p.id && p.name)
        .slice(0, 8)
        .map(product => ({
          ...product,
          _id: product.id,
          image: product.images?.[0] || '/images/furniture-placeholder.jpg',
          category: product.categoryId || 'Furniture',
          inStock: true
        }));
      
      setRelatedProducts(fallbackProducts);
      setCurrentSlide(0); // Reset slide position
    } finally {
      setRelatedLoading(false);
    }
  };

  // Fetch product from API with improved image handling
  // Enhanced to validate we're correctly handling 4 images per product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Fetching product with ID: ${productId}`);
        }
        const response = await productAPI.getById(productId);
        
        // Get product data and analyze the images
        const product = response.data;
        const mainImage = product.image;
        const additionalImages = product.images || [];
        
        // Check if we have Cloudinary URLs
        const mainImageIsCloudinary = mainImage ? ImageService.isCloudinaryUrl(mainImage) : false;
        const cloudinaryImageCount = additionalImages.filter(img => ImageService.isCloudinaryUrl(img)).length;
        
        // Log detailed image information (development only)
        if (process.env.NODE_ENV === 'development') {
          console.log('Product loaded:', { 
            name: product.name,
            id: product._id,
            hasMainImage: !!mainImage,
            additionalImageCount: additionalImages.length,
            cloudinaryImageCount,
            expectedImageCount: 4, // The database has 4 images per product
            mainImageIsCloudinary,
            imageTypes: {
              cloudinary: cloudinaryImageCount,
              other: additionalImages.length - cloudinaryImageCount
            }
          });
          
          // Log the actual image URLs (abbreviated)
          console.log('Image URLs:', [
            mainImage ? `Main: ${mainImage.substring(0, 50)}${mainImage.length > 50 ? '...' : ''}` : 'No main image',
            ...additionalImages.map((img, idx) => 
              `Image ${idx+1}: ${img.substring(0, 40)}${img.length > 40 ? '...' : ''} (${ImageService.isCloudinaryUrl(img) ? 'Cloudinary' : 'Other'})`
            )
          ]);
          
          if (!mainImage && additionalImages.length === 0) {
            console.warn('Product has no images - placeholders will be used');
          } else {
            console.log(`Product has ${additionalImages.length + (mainImage ? 1 : 0)} total images`);
          }
        }
        
        setProduct(product);
        setLoading(false);
        
        // Always fetch related products after main product loads
        fetchRelatedProducts(product);
        
        // Ensure we scroll to top when product loads
        scrollToTop({ instant: true });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching product:', error);
        }
        setError('Failed to load product details. Please try again.');
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Add a function to handle the "Back to Products" button click
  const handleBackToProducts = (e) => {
    e.preventDefault();
    navigate('/products');
    scrollToTop({ instant: true });
  };

  // Handle share functionality
  const handleShare = async () => {
    if (!product) return; // Guard clause
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this ${product.name} from Shree Manish Steel Furniture`,
          url: window.location.href
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // You could add a toast notification here
        if (process.env.NODE_ENV === 'development') {
          console.log('URL copied to clipboard');
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Error copying to clipboard:', error);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
            <Link 
              to="/products" 
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:text-primary-dark">
            Return to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen mobile-viewport mobile-scroll-smooth py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8">
      {/* Mobile Bottom Action Bar - Visible on small screens only */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:hidden z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <Link 
            to="/products"
            className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </Link>
          <a
            href={`https://wa.me/9779824336371?text=I'm interested in ${encodeURIComponent(product.name)}. Please provide more information.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-2 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
          <Link 
            to="/custom-order"
            className="flex-1 flex items-center justify-center px-3 py-2 border border-primary rounded-md text-sm font-medium text-primary hover:bg-primary-50"
          >
            Custom
          </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Breadcrumb - Enhanced for better visibility */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center flex-wrap space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" onClick={handleBackToProducts} className="hover:text-primary transition-colors">Products</Link>
            <span className="text-gray-400">/</span>
            <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>
        </div>
        
        {/* Product category & quick actions */}
        <div className="flex flex-wrap items-center justify-between mb-4 bg-white rounded-lg shadow-sm px-4 py-3 border border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="text-xs sm:text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              {product.category || "Furniture"}
            </div>
            {product.inStock !== false && (
              <div className="text-xs sm:text-sm px-2 py-1 bg-green-100 rounded-full text-green-700">
                In Stock
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <button 
              className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Add to wishlist"
            >
              <FaHeart size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images Section - Simplified and more user friendly */}
          <div className="space-y-6">
            {/* Main Product Image Viewer */}
            <div 
              className="relative rounded-lg overflow-hidden bg-white shadow-md"
              ref={imageContainerRef}
            >
              {/* Main image display area with touch support */}
              <div 
                className="relative w-full aspect-square bg-gray-50 flex items-center justify-center touch-manipulation"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Previous button - always visible on mobile */}
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-md z-10 opacity-75 hover:opacity-100 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="text-gray-700 text-xl" />
                </button>
                
                {/* Next button - always visible on mobile */}
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-md z-10 opacity-75 hover:opacity-100 transition-all duration-200"
                  aria-label="Next image"
                >
                  <FaChevronRight className="text-gray-700 text-xl" />
                </button>
                
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80 z-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-opacity-40 border-t-primary"></div>
                  </div>
                )}
                
                {/* Main product image */}
                <OptimizedImage
                  src={allImages[selectedImageIndex]}
                  alt={ImageService.getImageAlt(product) || "Product Image"}
                  category={product?.category}
                  size="large"
                  className={`w-full h-full transition-all duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'} cursor-pointer`}
                  onLoad={() => setImageLoading(false)}
                  onClick={handleImageZoom}
                  lazy={false}
                />
                
                {/* Enlarge button - positioned in bottom left corner */}
                <button 
                  onClick={handleImageZoom} 
                  className="absolute bottom-4 left-4 bg-black bg-opacity-60 hover:bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all duration-200 z-10"
                  aria-label="View full screen"
                >
                  <FaExpand className="text-white text-sm" />
                </button>
              </div>
            </div>
            {/* Enhanced Thumbnail Container - larger, more professional */}
            {allImages.length > 1 && (
              <div className="flex justify-center">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white rounded-xl shadow-md border border-gray-100 p-2">
                  {allImages.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-32 h-32 rounded-xl border-2 transition-all duration-200 bg-gray-50 shadow-sm hover:shadow-lg ${selectedImageIndex === idx ? 'border-primary ring-2 ring-primary' : 'border-gray-200 hover:border-primary'}`}
                      aria-label={`View product image ${idx + 1}`}
                    >
                      <div className="w-full h-full overflow-hidden rounded-xl relative">
                        <OptimizedImage
                          src={img}
                          alt={`Product view ${idx + 1}`}
                          category={product?.category}
                          size="thumbnail"
                          className="w-full h-full object-cover"
                          lazy={false}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Details Section - Enhanced for better UX */}
          <div className="space-y-6 flex flex-col">
            {/* Product header - Always first */}
            <div className="order-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  
                  {/* Category and subcategory breadcrumb */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>{product.category?.name || product.category || 'Furniture'}</span>
                    {product.subcategory && (
                      <>
                        <span className="mx-2">›</span>
                        <span>{product.subcategory?.name || product.subcategory}</span>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Share button */}
                <button
                  onClick={handleShare}
                  className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Share this product"
                >
                  <FaShare size={16} />
                </button>
              </div>

              {/* Product description */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-600 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features list */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Additional Product Information - Accordion Style - Mobile First */}
            <div className="order-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {/* Specifications Section */}
                <details className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-800">Specifications</h3>
                    <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    {product.specifications && product.specifications.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="flex flex-col space-y-1">
                            <span className="text-sm text-gray-500">{spec.label}</span>
                            <span className="font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-500">Material</span>
                          <span className="font-medium">{product.material || "Steel"}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-500">Dimensions</span>
                          <span className="font-medium">
                            {product.dimensions && (product.dimensions.length || product.dimensions.width || product.dimensions.height) 
                              ? `${product.dimensions.length || 'N/A'} × ${product.dimensions.width || 'N/A'} × ${product.dimensions.height || 'N/A'} cm`
                              : "Contact for details"}
                          </span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-500">Finish</span>
                          <span className="font-medium">{product.finish || "Premium"}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-gray-500">Weight</span>
                          <span className="font-medium">{product.weight || "Varies by model"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
                
                {/* Delivery Information Section */}
                <details className="group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <h3 className="text-lg font-medium text-gray-800">Delivery Information</h3>
                    <span className="ml-2 text-gray-500 group-open:rotate-180 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
                      </svg>
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-gray-600">
                    {product.deliveryInformation ? (
                      <div className="space-y-3">
                        {product.deliveryInformation.estimatedDelivery && (
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <div>
                              <span className="font-medium">Estimated Delivery: </span>
                              <span>{product.deliveryInformation.estimatedDelivery}</span>
                            </div>
                          </div>
                        )}
                        {product.deliveryInformation.shippingCost && (
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <div>
                              <span className="font-medium">Shipping Cost: </span>
                              <span>{product.deliveryInformation.shippingCost}</span>
                            </div>
                          </div>
                        )}
                        {product.deliveryInformation.availableLocations && product.deliveryInformation.availableLocations.length > 0 && (
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <div>
                              <span className="font-medium">Available Locations: </span>
                              <span>{product.deliveryInformation.availableLocations.join(', ')}</span>
                            </div>
                          </div>
                        )}
                        {product.deliveryInformation.specialInstructions && (
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <div>
                              <span className="font-medium">Special Instructions: </span>
                              <span>{product.deliveryInformation.specialInstructions}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="mb-3">Delivery options and timeframes may vary based on your location and product availability.</p>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <span>Free delivery within Kathmandu Valley</span>
                          </li>
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <span>Installation services available</span>
                          </li>
                          <li className="flex items-start">
                            <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                            <span>Contact us for shipping to other locations</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            </div>
            
            {/* Action Buttons - Visible on all devices */}
            <div className="flex flex-col gap-3 pt-6 order-3">
              <a
                href={`https://wa.me/9779824336371?text=I'm interested in ${encodeURIComponent(product.name)} (ID: ${product._id}). Please provide more information.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4 border border-transparent rounded-lg shadow-sm text-sm sm:text-base font-medium text-white bg-green-600 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Inquire on WhatsApp
              </a>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/products"
                  className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm text-sm sm:text-base font-medium text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                >
                  Back to Products
                </Link>
                
                <Link 
                  to="/custom-order"
                  className="flex-1 flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-primary rounded-lg shadow-sm text-sm sm:text-base font-medium text-primary hover:bg-primary-50 active:bg-primary-100 transition-all duration-200"
                >
                  Request Customization
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* You might also like - Related Products */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">You might also like</h2>
          </div>
          
          {relatedLoading ? (
            // Loading skeleton for related products
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4">
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <>
              {/* Mobile: Scrollable Grid - Desktop: Carousel */}
              {/* Mobile View: Grid Layout */}
              <div className="lg:hidden">
                <div className="grid grid-cols-2 gap-4">
                  {relatedProducts.slice(0, 8).map((relatedProduct) => (
                    <div key={relatedProduct._id || relatedProduct.id}>
                      <ProductCard
                        product={relatedProduct}
                        onQuickView={openQuickView}
                        variant="standard"
                        showCategory={false}
                        withActions={true}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Show More button if there are more than 8 products */}
                {relatedProducts.length > 8 && (
                  <div className="text-center mt-6">
                    <Link 
                      to="/products" 
                      className="inline-flex items-center px-6 py-3 border border-primary rounded-lg shadow-sm text-base font-medium text-primary hover:bg-primary-50 active:bg-primary-100 transition-all duration-200"
                    >
                      View All Products
                    </Link>
                  </div>
                )}
              </div>

              {/* Desktop View: Carousel Layout */}
              <div className="hidden lg:block">
                <div className="relative mx-12">
                  {/* Left Navigation Arrow - only show if not at beginning */}
                  {relatedProducts.length > getProductsPerView() && currentSlide > 0 && (
                    <button
                      onClick={prevSlide}
                      className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      aria-label="Previous products"
                    >
                      <FaChevronLeft className="h-5 w-5" />
                    </button>
                  )}
                  
                  {/* Right Navigation Arrow - only show if there are more slides */}
                  {relatedProducts.length > getProductsPerView() && currentSlide < getTotalSlides() - 1 && (
                    <button
                      onClick={nextSlide}
                      className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
                      aria-label="Next products"
                    >
                      <FaChevronRight className="h-5 w-5" />
                    </button>
                  )}
                  
                  <div 
                    ref={relatedProductsRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                  >
                    {relatedProducts.map((relatedProduct) => (
                      <div
                        key={relatedProduct._id || relatedProduct.id}
                        className="flex-none w-[calc(25%-12px)]"
                      >
                        <ProductCard
                          product={relatedProduct}
                          onQuickView={openQuickView}
                          variant="standard"
                          showCategory={false}
                          withActions={true}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Slide indicators */}
                  {relatedProducts.length > getProductsPerView() && (
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({ length: getTotalSlides() }, (_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentSlide(index);
                            scrollToSlide(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            currentSlide === index
                              ? 'bg-primary w-6'
                              : 'bg-gray-300 hover:bg-gray-400'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // This should rarely happen now with the robust fallback system
            <div className="text-center py-8 text-gray-500">
              <p>Loading related products...</p>
              <Link 
                to="/products" 
                className="inline-block mt-2 text-primary hover:text-primary/80 font-medium"
              >
                Browse all products →
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* QuickView Modal for related products */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        variant="standard"
      />
      
      {/* Full Screen Image Overlay */}
      {fullScreenView && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={handleFullScreenClose}
        >
          {/* Close button */}
          <button
            onClick={handleFullScreenClose}
            className="absolute top-4 right-4 z-60 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center text-white transition-all duration-200"
            aria-label="Close full screen"
          >
            <FaTimes className="text-xl" />
          </button>
          
          {/* Navigation buttons in full screen */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center text-white transition-all duration-200 z-60"
                aria-label="Previous image"
              >
                <FaChevronLeft className="text-xl" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full w-12 h-12 flex items-center justify-center text-white transition-all duration-200 z-60"
                aria-label="Next image"
              >
                <FaChevronRight className="text-xl" />
              </button>
            </>
          )}
          
          {/* Full screen image */}
          <div 
            className="max-w-full max-h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <OptimizedImage
              src={allImages[selectedImageIndex]}
              alt={ImageService.getImageAlt(product) || "Product Image"}
              category={product?.category}
              size="large"
              className="max-w-full max-h-full object-contain"
              lazy={false}
            />
          </div>
          
          {/* Image counter in full screen */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {allImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
