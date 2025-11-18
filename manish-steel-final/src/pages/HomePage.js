import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import homePageImage from '../assets/home-page-1.png';
import { PlaceholderImage } from '../utils/placeholders';
import { useCategoryNavigation } from '../hooks/useCategoryNavigation';
import cacheService from '../services/cacheService';
import CategoryImageService from '../services/categoryImageService';
import CleanTopProductsSection from '../components/CleanTopProductsSection';
import CleanMostSellingSection from '../components/CleanMostSellingSection';
import { testimonials } from '../data/testimonials';
import ScrollAnimator from '../components/ScrollAnimator';
import OptimizedImage from '../components/common/OptimizedImage';
// ApiDebugger removed for production
import { getContactInfo, getServices } from '../utils/storage';

const HomePage = () => {
  // Use optimized category navigation hook
  const { categories, loading, navigateToCategory } = useCategoryNavigation();
  // State for category thumbnail images
  const [categoryThumbnails, setCategoryThumbnails] = useState({});
  // Additional loading state for thumbnails
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);
  // State for hero image - with stability to prevent flashing
  const [heroImage, setHeroImage] = useState(homePageImage);
  const [imageKey, setImageKey] = useState(Date.now()); // Force re-render when image changes
  
  // State for testimonial carousel
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const testimonialsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
  
  // Contact information state
  const [contactInfo, setContactInfo] = useState({
    address: 'Dharan Rd, Biratnagar 56613, Nepal',
    phone: '+977 982-4336371',
    email: 'shreemanishfurniture@gmail.com',
    businessHours: 'Sunday - Friday: 8:00 AM - 7:00 PM\nSaturday: 8:00 AM - 12:00 PM',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3572.089636105974!2d87.27763091503517!3d26.49980678332793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef7395d46084a5%3A0xc709a12df1274cc8!2sShree%20Manish%20Steel%20Furniture%20Udhyog%20Pvt.%20Ltd.!5e0!3m2!1sen!2snp!4v1680000000000'
  });
  
  // Services state
  const [services, setServices] = useState([]);

  // Load contact information and services from storage
  useEffect(() => {
    try {
      const storedContactInfo = getContactInfo();
      if (storedContactInfo) {
        setContactInfo(storedContactInfo);
      }
      
      const storedServices = getServices();
      if (storedServices) {
        setServices(storedServices);
      }
    } catch (error) {
      console.error('Error loading contact info or services:', error);
    }
  }, []);

  // Load hero image from homepage settings - with live updates from admin panel
  useEffect(() => {
    const loadHeroImage = () => {
      try {
        const savedSettings = localStorage.getItem('homepageSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.heroImage && settings.heroImage !== heroImage) {
            console.log('Loading hero image from settings:', settings.heroImage);
            // Check if it's a base64 data URL or a file path
            if (settings.heroImage.startsWith('data:')) {
              console.log('Using base64 image from upload');
            } else {
              console.log('Using file path image');
            }
            setHeroImage(settings.heroImage);
            setImageKey(Date.now()); // Force re-render only when image actually changes
          }
        } else {
          // No settings found, use default
          console.log('No homepage settings found, using default image:', homePageImage);
          if (heroImage !== homePageImage) {
            setHeroImage(homePageImage);
            setImageKey(Date.now());
          }
        }
      } catch (error) {
        console.error('Error loading homepage settings:', error);
        // Fallback to default image on error
        console.log('Falling back to default image due to error');
        if (heroImage !== homePageImage) {
          setHeroImage(homePageImage);
          setImageKey(Date.now());
        }
      }
    };

    // Load initially
    loadHeroImage();

    // Listen for storage changes (when admin panel updates the image)
    const handleStorageChange = (e) => {
      if (e.key === 'homepageSettings') {
        loadHeroImage();
      }
    };

    // Listen for custom events when localStorage is updated from same tab
    const handleHomepageUpdate = () => {
      loadHeroImage();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('homepageSettingsUpdated', handleHomepageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('homepageSettingsUpdated', handleHomepageUpdate);
    };
  }, []); // Keep empty dependency to set up listeners once

  // Preload common products when component mounts for instant browsing
  useEffect(() => {
    setTimeout(() => {
      cacheService.preloadCommonProducts();
      // Also preload category thumbnails for better UX
      CategoryImageService.preloadCommonCategoryThumbnails();
    }, 500);
  }, []);
  
  // Load thumbnail images for each category
  useEffect(() => {
    const loadCategoryThumbnails = async () => {
      if (!categories || categories.length === 0) return;
      
      setLoadingThumbnails(true);
      const thumbnails = {};
      
      // Also preload thumbnails for hardcoded fallback category IDs
      const fallbackCategoryIds = ['684c14969550362979fd95a2', '684c14969550362979fd95a3', '684c14969550362979fd95a4'];
      
      // Combine all category IDs to load thumbnails for
      const allCategoryIds = [
        ...categories.map(category => category._id || category.id),
        ...fallbackCategoryIds
      ];
      
      // Process all categories in parallel for better performance
      await Promise.all(allCategoryIds.map(async (categoryId) => {
        try {
          const category = categories.find(c => (c._id || c.id) === categoryId) || 
                          { name: categoryId === '684c14969550362979fd95a2' ? 'Household Furniture' :
                                 categoryId === '684c14969550362979fd95a3' ? 'Office Furniture' : 
                                 'Commercial Furniture' };
                                 
          const thumbnail = await CategoryImageService.getCategoryThumbnailImage(
            categoryId,
            category.name
          );
          thumbnails[categoryId] = thumbnail;
          console.log(`Loaded thumbnail for ${category.name}: ${thumbnail.substring(0, 30)}...`);
        } catch (error) {
          console.error(`Failed to load thumbnail for category ${categoryId}:`, error);
        }
      }));
      
      setCategoryThumbnails(thumbnails);
      setLoadingThumbnails(false);
    };
    
    if (categories && categories.length > 0) {
      loadCategoryThumbnails();
    }
  }, [categories]);

  // Handle category click with instant navigation
  const handleCategoryClick = (categoryId, categoryName) => {
    console.log('HomePage: Category clicked', { categoryId, categoryName });
    // Use category ID for professional API calls - backend supports both ID and name filtering
    navigateToCategory(categoryId);
  };

  // Calculate total pages for carousel
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  
  // Handle window resize for responsive display
  useEffect(() => {
    const handleResize = () => {
      const newTestimonialsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const newTotalPages = Math.ceil(testimonials.length / newTestimonialsPerPage);
      if (currentTestimonialPage >= newTotalPages) {
        setCurrentTestimonialPage(newTotalPages - 1);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentTestimonialPage, testimonials.length]);
  
  // Functions to handle testimonial navigation
  const nextTestimonialPage = () => {
    setCurrentTestimonialPage(prev => (prev + 1) % totalPages);
  };
  
  const prevTestimonialPage = () => {
    setCurrentTestimonialPage(prev => (prev - 1 + totalPages) % totalPages);
  };
  
  // Calculate which testimonials to show
  const visibleTestimonials = testimonials.slice(
    currentTestimonialPage * testimonialsPerPage,
    (currentTestimonialPage * testimonialsPerPage) + testimonialsPerPage
  );

  return (
    <div>
      {/* Hero Section with Image on Right */}
      <section className="min-h-[85vh] flex items-center justify-center bg-background overflow-hidden py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left Content */}
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10 animate-fadeIn">
              {/* Premium Typography for Shree Manish Steel Furniture Udhyog */}
              <div className="text-center md:text-left">
                <p className="text-sm text-primary font-normal tracking-wider uppercase mb-1 animate-fadeIn">
                  Furniture Udhyog
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-none animate-slideInLeft" style={{fontFamily: 'Playfair Display, serif'}}>
                  Shree Manish Steel
                </h1>
              </div>
              
              {/* Commented out old content
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6 animate-slideInLeft">
                <span className="block mb-2">Furniture for Every Space </span>
                <span className="text-2xl md:text-3xl text-gray-600">Made in Nepal</span>
              </h1>
              <p className="text-lg text-text/80 mb-8 animate-slideInLeft" style={{animationDelay: '0.2s'}}>
                Quality furniture for homes and offices at affordable prices. 
                Serving Biratnagar and all of Nepal.
              </p>
              */}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-8 animate-slideInLeft" style={{animationDelay: '0.3s'}}>
                <Link 
                  to="/products" 
                  className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg text-sm"
                  style={{minWidth: '130px', textAlign: 'center'}}
                >
                  View Products
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-white text-primary font-semibold px-6 py-2.5 rounded-lg border-2 border-primary hover:bg-primary/5 transition-all duration-300 shadow-sm text-sm"
                  style={{minWidth: '130px', textAlign: 'center'}}
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="md:w-1/2 animate-fadeIn" style={{animationDelay: '0.3s'}}>
              <div className="relative">
                <img
                  key={imageKey}
                  src={heroImage} 
                  alt="Manish Steel Furniture Collection" 
                  className="w-full h-auto rounded-lg shadow-xl object-cover"
                  style={{ minHeight: '400px', maxHeight: '500px' }}
                  onLoad={() => {
                    console.log('Hero image loaded successfully:', heroImage);
                  }}
                  onError={(e) => {
                    console.log('Hero image failed, using fallback:', homePageImage);
                    // Fallback to default image if custom image fails to load
                    if (e.target.src !== homePageImage) {
                      e.target.src = homePageImage;
                    }
                  }}
                />
                <div className="absolute -bottom-4 -right-4 bg-accent w-24 h-24 rounded-full flex items-center justify-center text-primary font-bold text-lg z-10">
                  New<br/>Designs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <ScrollAnimator animation="fadeUp">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h2>
          </ScrollAnimator>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <ScrollAnimator animation="fadeUp" delay={0.1}>
              <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm h-full md:h-56 flex flex-col">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-spin-slow flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center mb-2 flex-shrink-0">Premium Quality</h3>
                <p className="text-center text-xs md:text-sm flex-grow">
                  High-grade durable steel furniture built to last.
                </p>
              </div>
            </ScrollAnimator>
            
            <ScrollAnimator animation="fadeUp" delay={0.2}>
              <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm h-full md:h-56 flex flex-col">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-spin-slow flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center mb-2 flex-shrink-0">Modern Design</h3>
                <p className="text-center text-xs md:text-sm flex-grow">
                  Contemporary and stylish designs for every space.
                </p>
              </div>
            </ScrollAnimator>
            
            <ScrollAnimator animation="fadeUp" delay={0.3}>
              <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm h-full md:h-56 flex flex-col">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-spin-slow flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center mb-2 flex-shrink-0">Fast Delivery</h3>
                <p className="text-center text-xs md:text-sm flex-grow">
                  Quick and reliable delivery service across Nepal.
                </p>
              </div>
            </ScrollAnimator>
            
            <ScrollAnimator animation="fadeUp" delay={0.4}>
              <div className="bg-white/10 p-4 md:p-6 rounded-lg backdrop-blur-sm h-full md:h-56 flex flex-col">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent rounded-full flex items-center justify-center mb-3 md:mb-4 mx-auto animate-spin-slow flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-center mb-2 flex-shrink-0">Customer Support</h3>
                <p className="text-center text-xs md:text-sm flex-grow">
                  24/7 dedicated customer support and assistance.
                </p>
              </div>
            </ScrollAnimator>
          </div>
        </div>
      </section>
      
      {/* Instant Category Display Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary text-center mb-8 animate-fadeIn">
            Browse Our Collections
          </h2>
          
          {/* Mobile Scroll Indicator */}
          <div className="md:hidden text-center mb-4">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Swipe to see more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </p>
          </div>
          
          {/* Display loading state or categories */}
          {loading ? (
            <div className="flex md:grid overflow-x-auto md:overflow-x-visible gap-8 md:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory md:snap-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {[1, 2, 3].map((index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0 w-[85vw] md:w-auto snap-center">
                  <div className="aspect-[4/3] bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="bg-gray-200 h-6 rounded mb-2 animate-pulse"></div>
                    <div className="bg-gray-200 h-4 rounded mb-4 w-3/4 animate-pulse"></div>
                    <div className="bg-gray-200 h-8 rounded w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex md:grid overflow-x-auto md:overflow-x-visible gap-8 md:grid-cols-2 lg:grid-cols-3 snap-x snap-mandatory md:snap-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {categories && categories.length > 0 ? (
                categories.map((category, index) => (
                  <div 
                    key={category._id || category.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeInUp group flex-shrink-0 w-[85vw] md:w-auto snap-center"
                    style={{animationDelay: `${0.1 + (index * 0.1)}s`}}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      {categoryThumbnails[category._id || category.id] ? (
                        // Use actual product image from the category's products
                        <OptimizedImage 
                          src={categoryThumbnails[category._id || category.id]}
                          alt={`${category.name} Products`} 
                          category={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        // Fallback to placeholder while loading
                        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">
                          Loading products...
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button 
                          onClick={() => handleCategoryClick(category._id || category.id, category.name)}
                          className="bg-primary text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Browse Products
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">{category.name}</h3>
                      <p className="text-text/80 mb-4 line-clamp-2">
                        {category.description || `Quality ${category.name.toLowerCase()} made with precision and care for your needs.`}
                      </p>
                      <button 
                        onClick={() => handleCategoryClick(category._id || category.id, category.name)}
                        className="text-primary font-medium hover:text-primary/80 flex items-center group"
                      >
                        View Collection
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback categories for instant display
                <>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeInUp group flex-shrink-0 w-[85vw] md:w-auto snap-center" style={{animationDelay: '0.1s'}}>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      {/* This will be called when fallback categories are shown */}
                      <OptimizedImage
                        src={categoryThumbnails['684c14969550362979fd95a2'] || '/placeholders/Household-Furniture.png'}
                        alt="Household Furniture"
                        category="Household Furniture"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button 
                          onClick={() => handleCategoryClick('684c14969550362979fd95a2', 'Household Furniture')}
                          className="bg-primary text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Browse Products
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">Household Furniture</h3>
                      <p className="text-text/80 mb-4 line-clamp-2">
                        Quality household furniture made with precision and care for your home.
                      </p>
                      <button 
                        onClick={() => handleCategoryClick('684c14969550362979fd95a2', 'Household Furniture')}
                        className="text-primary font-medium hover:text-primary/80 flex items-center group"
                      >
                        View Collection
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeInUp group flex-shrink-0 w-[85vw] md:w-auto snap-center" style={{animationDelay: '0.2s'}}>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <OptimizedImage 
                        src={categoryThumbnails['684c14969550362979fd95a3'] || '/placeholders/Office-Products.png'} 
                        alt="Office Furniture" 
                        category="Office Furniture"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button 
                          onClick={() => handleCategoryClick('684c14969550362979fd95a3', 'Office Furniture')}
                          className="bg-primary text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Browse Products
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">Office Furniture</h3>
                      <p className="text-text/80 mb-4 line-clamp-2">
                        Professional office furniture for productive workspaces.
                      </p>
                      <button 
                        onClick={() => handleCategoryClick('684c14969550362979fd95a3', 'Office Furniture')}
                        className="text-primary font-medium hover:text-primary/80 flex items-center group"
                      >
                        View Collection
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeInUp group flex-shrink-0 w-[85vw] md:w-auto snap-center" style={{animationDelay: '0.3s'}}>
                    <div className="relative w-full aspect-[4/3] overflow-hidden">
                      <OptimizedImage 
                        src={categoryThumbnails['684c14969550362979fd95a4'] || '/placeholders/Commercial-Shelving.png'} 
                        alt="Commercial Furniture" 
                        category="Commercial Furniture"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                        <button 
                          onClick={() => handleCategoryClick('684c14969550362979fd95a4', 'Commercial Furniture')}
                          className="bg-primary text-white px-6 py-2 rounded-full font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                          Browse Products
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-primary mb-2">Commercial Furniture</h3>
                      <p className="text-text/80 mb-4 line-clamp-2">
                        Durable commercial furniture for business environments.
                      </p>
                      <button 
                        onClick={() => handleCategoryClick('684c14969550362979fd95a4', 'Commercial Furniture')}
                        className="text-primary font-medium hover:text-primary/80 flex items-center group"
                      >
                        View Collection
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <div className="flex justify-center mt-10">
            <Link 
              to="/products"
              className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/80 transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              View All Products
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Our Top Products Section */}
      <CleanTopProductsSection />
      
      {/* Most Selling Products Section */}
      <CleanMostSellingSection />
      

      
      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fadeIn">Ready to Transform Your Space?</h2>
          <p className="text-lg md:text-xl mb-8 animate-fadeIn" style={{animationDelay: '0.2s'}}>
            Contact us today to discuss your furniture needs or visit our showroom to see our products in person.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <Link 
              to="/contact" 
              className="bg-white text-primary font-bold px-8 py-3 rounded-md hover:bg-white/90 transition-all hover:scale-105"
              style={{minWidth: '140px', textAlign: 'center'}}
            >
              Contact Us
            </Link>
            <Link 
              to="/custom-order" 
              className="bg-accent text-primary font-bold px-8 py-3 rounded-md hover:bg-accent/80 transition-all hover:scale-105"
              style={{minWidth: '140px', textAlign: 'center'}}
            >
              Request Custom Order
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive furniture solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl text-primary">{service.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Simplified */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">
              Nepal's Leading Steel Furniture Manufacturer
            </h2>
            
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Trusted by thousands of customers across Nepal for premium quality steel furniture 
              at affordable prices.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">🏆</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">15+ Years Experience</h3>
                <p className="text-gray-600 text-sm">Trusted manufacturing expertise</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">🚚</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Across Biratnagar, Dharan, Itahari & near by places</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary text-2xl">💎</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600 text-sm">5-year warranty & free installation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Visit Our Showroom</h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Experience our furniture collection in person at our Biratnagar showroom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                  <div>
                    <span className="font-medium">Address: </span>
                    <span className="text-gray-600">{contactInfo.address}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                  <div>
                    <span className="font-medium">Phone: </span>
                    <span className="text-gray-600">{contactInfo.phone}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                  <div>
                    <span className="font-medium">Email: </span>
                    <span className="text-gray-600">{contactInfo.email}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3 mt-0.5">•</span>
                  <div>
                    <span className="font-medium">Business Hours: </span>
                    <div className="text-gray-600">
                      {contactInfo.businessHours && contactInfo.businessHours.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 md:px-6 md:py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-sm md:text-base"
                >
                  Get Directions
                </Link>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="lg:col-span-2 rounded-lg overflow-hidden shadow-lg h-[400px]">
              <div className="relative w-full h-full">
                <iframe 
                  src={contactInfo.mapUrl}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Shree Manish Steel Furniture Location"
                  className="w-full h-full"
                  onError={(e) => {
                    // Silently handle iframe errors in production
                    if (process.env.NODE_ENV === 'production') {
                      e.target.style.display = 'none';
                    }
                  }}
                  onLoad={() => {
                    // Suppress any console errors from the iframe content
                    if (process.env.NODE_ENV === 'production') {
                      try {
                        const iframe = document.querySelector('iframe[title="Shree Manish Steel Furniture Location"]');
                        if (iframe && iframe.contentWindow) {
                          iframe.contentWindow.console = { 
                            ...iframe.contentWindow.console,
                            error: () => {} // Suppress errors
                          };
                        }
                      } catch (e) {
                        // Cross-origin access may be blocked, that's fine
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section - Moved after Location */}
      <section className="py-16 bg-gradient-to-b from-gray-100 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute transform -rotate-12 -left-10 top-10 text-9xl font-bold text-primary">"</div>
          <div className="absolute transform rotate-12 -right-10 bottom-10 text-9xl font-bold text-primary">"</div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary text-center mb-3 animate-fadeIn">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover why our customers trust us with their furniture needs. Here's what they have to say about their experience with Shree Manish Steel.</p>
          </div>
          
          {/* Testimonial Cards with Navigation */}
          <div className="relative">
            {/* Previous Button */}
            <button 
              onClick={prevTestimonialPage}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-primary hover:text-white transition-colors"
              aria-label="Previous testimonials"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleTestimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id} 
                  className="bg-white p-6 rounded-lg shadow-md transform hover:-translate-y-1 transition-transform duration-300 border border-gray-100 relative animate-fadeInUp"
                  style={{animationDelay: `${0.1 + (index * 0.2)}s`}}
                >
                  {testimonial.verified && (
                    <div className="absolute -top-3 -right-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full border border-green-200 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </div>
                  )}
                  
                  <div className="flex items-center mb-4">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary" 
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                        <span className="text-primary font-bold">{testimonial.initials}</span>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <span className="text-gray-500 text-sm ml-2">• {testimonial.location}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i}
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Purchased: {testimonial.productPurchased}</div>
                    <p className="text-text/80 italic">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Next Button */}
            <button 
              onClick={nextTestimonialPage}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 bg-white p-2 rounded-full shadow-lg z-20 hover:bg-primary hover:text-white transition-colors"
              aria-label="Next testimonials"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentTestimonialPage(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${currentTestimonialPage === i ? 'bg-primary w-8' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial page ${i + 1}`}
              />
            ))}
          </div>
          
          {/* View More Testimonials Link */}
          <div className="text-center mt-8">
            <Link 
              to="/gallery#testimonials"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group"
            >
              View More Testimonials
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* API Debugger completely removed for production */}
    </div>
  );
};

export default HomePage;
