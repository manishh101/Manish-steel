import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link, useLocation } from 'react-router-dom';
import newLogo from '../assets/new-logo-1.png';
import { scrollToTop } from '../utils/scrollUtils';
import { useSmartScroll } from '../hooks/useSmartScroll';
import EnhancedSearch from './EnhancedSearch';

const Header = forwardRef(({ onMenuStateChange }, ref) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Use the smart scroll hook for better header behavior
  const isHeaderVisible = useSmartScroll({
    hideThreshold: 80,    // Hide after scrolling down 80px
    showOnTop: 10,        // Always show when within 10px of top
    onlyMobile: false,    // Apply on all screen sizes for consistent UX
    throttleMs: 8         // Fast response time
  });

  // Listen for mobile menu state changes from LayoutWrapper
  useEffect(() => {
    const handleMenuStateChange = (e) => {
      if (e.detail && typeof e.detail.isOpen === 'boolean') {
        setIsMenuOpen(e.detail.isOpen);
      }
    };
    
    window.addEventListener('mobileMenuStateChanged', handleMenuStateChange);
    return () => window.removeEventListener('mobileMenuStateChanged', handleMenuStateChange);
  }, []);

  // Add body padding for fixed header on both mobile and desktop
  useEffect(() => {
    const updateBodyPadding = () => {
      if (window.innerWidth < 768) {
        // Mobile: Add padding to prevent content from hiding behind fixed header
        document.body.style.paddingTop = '76px';
      } else {
        // Desktop: Add padding for fixed header
        document.body.style.paddingTop = '64px'; // Adjust based on actual header height
      }
    };

    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);
    
    return () => {
      window.removeEventListener('resize', updateBodyPadding);
      document.body.style.paddingTop = '0px'; // Clean up on unmount
    };
  }, []);

  // Check if current path matches the link
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    // Instead of handling everything here, just dispatch the event
    // and let LayoutWrapper handle the actual menu state
    const event = new CustomEvent('mobileMenuStateChanged', { 
      detail: { isOpen: !isMenuOpen } 
    });
    window.dispatchEvent(event);
  };
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    toggleMobileMenu
  }));

  // Add a function to handle the mobile search button click
  const handleMobileSearchButtonClick = () => {
    // Dispatch custom event to notify MobileMenuDrawer to open and focus search
    const event = new CustomEvent('openMobileMenuWithSearch', {
      detail: { focusSearch: true }
    });
    window.dispatchEvent(event);
  };

  // Handle link clicks to scroll to top
  const handleNavLinkClick = (e, path) => {
    // If it's the same path, just scroll to top with enhanced behavior
    if (location.pathname === path) {
      e.preventDefault();
      scrollToTop({ instant: true });
    }
  };

  return (
    <header 
      className={`bg-white/95 backdrop-blur-md z-30 transition-all duration-300 ease-out fixed top-0 left-0 right-0 border-b border-gray-100/50 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Mobile Layout */}
        <div className="md:hidden flex items-center justify-between py-3">
          {/* Left: Mobile Menu Button */}
          <div className="flex-shrink-0 z-40">
            <button
              onClick={toggleMobileMenu}
              className={`text-primary hover:text-primary-dark transition-all duration-200 focus:outline-none p-2 rounded-full hover:bg-gray-100 active:scale-95 ${
                isMenuOpen ? 'bg-primary/8 transform scale-105' : ''
              }`} 
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex-shrink-0 z-40 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/" className="flex items-center" onClick={(e) => handleNavLinkClick(e, '/')}>
              <img src={newLogo} alt="Shree Manish Steel Furniture Industry" className="h-14" />
            </Link>
          </div>

          {/* Right: Search Button */}
          <div className="flex-shrink-0 z-40">
            <button
              onClick={handleMobileSearchButtonClick}
              className="text-primary hover:text-primary-dark transition-colors focus:outline-none p-2 rounded-full hover:bg-gray-100 active:scale-95"
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between pt-3 pb-1.5">
          {/* Logo Section - Left */}
          <div className="flex-shrink-0 z-40 w-64">
            <Link to="/" className="flex items-center" onClick={(e) => handleNavLinkClick(e, '/')}>
              <img src={newLogo} alt="Shree Manish Steel Furniture Industry" className="h-12" />
            </Link>
          </div>

          {/* Centered Navigation Links */}
          <nav className="flex-grow flex justify-center">
            <ul className="flex items-center space-x-5">
              <li><Link to="/" onClick={(e) => handleNavLinkClick(e, '/')} className={`text-sm font-semibold uppercase leading-relaxed tracking-tight transition-colors ${isActive('/') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'}`}>Home</Link></li>
              <li><Link to="/products" onClick={(e) => handleNavLinkClick(e, '/products')} className={`text-sm font-semibold uppercase leading-relaxed tracking-tight transition-colors ${isActive('/products') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'}`}>Products</Link></li> 
              <li><Link to="/gallery" onClick={(e) => handleNavLinkClick(e, '/gallery')} className={`text-sm font-semibold uppercase leading-relaxed tracking-tight transition-colors ${isActive('/gallery') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'}`}>Gallery</Link></li>
              <li><Link to="/about" onClick={(e) => handleNavLinkClick(e, '/about')} className={`text-sm font-semibold uppercase leading-relaxed tracking-tight transition-colors ${isActive('/about') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'}`}>About</Link></li>
              <li><Link to="/contact" onClick={(e) => handleNavLinkClick(e, '/contact')} className={`text-sm font-semibold uppercase leading-relaxed tracking-tight transition-colors ${isActive('/contact') ? 'text-primary border-b-2 border-primary' : 'text-gray-700 hover:text-primary'}`}>Contact us</Link></li>
              <li><Link to="/custom-order" onClick={(e) => handleNavLinkClick(e, '/custom-order')} className="bg-accent text-primary text-sm font-semibold uppercase leading-relaxed tracking-tight px-4 py-2 rounded-md hover:bg-accent/80 transition-colors">Customized Order</Link></li>
            </ul>
          </nav>

          {/* Search Bar - Right (same width as logo section for balance) */}
          <div className="flex-shrink-0 w-64 flex justify-end">
            <EnhancedSearch 
              placeholder="Search steel furniture..." 
              className="w-64"
              showSuggestions={true}
            />
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
