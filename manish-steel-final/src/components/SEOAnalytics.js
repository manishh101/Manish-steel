import { useEffect } from 'react';

const SEOAnalytics = () => {
  useEffect(() => {
    // Google Analytics 4 (GA4) - Replace YOUR_GA4_ID with actual tracking ID
    const GA4_ID = 'G-XXXXXXXXXX'; // Replace with actual Google Analytics 4 ID
    
    // Load Google Analytics
    const loadGA4 = () => {
      // Google tag (gtag.js)
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(script1);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', GA4_ID);
      
      // Make gtag globally available
      window.gtag = gtag;
    };
    
    // Google Search Console verification (add your verification code)
    const addSearchConsoleVerification = () => {
      const meta = document.createElement('meta');
      meta.name = 'google-site-verification';
      meta.content = 'YOUR_SEARCH_CONSOLE_VERIFICATION_CODE'; // Replace with actual code
      document.head.appendChild(meta);
    };
    
    // Facebook Pixel (optional for social media tracking)
    const loadFacebookPixel = () => {
      // Add Facebook Pixel code here if needed
      // Replace YOUR_PIXEL_ID with actual Facebook Pixel ID
      /*
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'YOUR_PIXEL_ID');
      fbq('track', 'PageView');
      */
    };
    
    // Track page views for SPA
    const trackPageView = (url = window.location.pathname + window.location.search) => {
      if (window.gtag) {
        window.gtag('config', GA4_ID, {
          page_path: url,
        });
      }
    };
    
    // Custom event tracking for furniture business
    const trackCustomEvents = () => {
      // Track product views
      window.trackProductView = (productName, category, price) => {
        if (window.gtag) {
          window.gtag('event', 'view_item', {
            currency: 'NPR',
            value: price,
            items: [{
              item_id: productName.toLowerCase().replace(/\s+/g, '-'),
              item_name: productName,
              item_category: category,
              quantity: 1,
              price: price
            }]
          });
        }
      };
      
      // Track inquiries
      window.trackInquiry = (productName = 'General') => {
        if (window.gtag) {
          window.gtag('event', 'generate_lead', {
            currency: 'NPR',
            value: 1000, // Estimated lead value
            items: [{
              item_name: productName,
              item_category: 'Inquiry'
            }]
          });
        }
      };
      
      // Track phone clicks
      window.trackPhoneClick = () => {
        if (window.gtag) {
          window.gtag('event', 'contact', {
            method: 'phone'
          });
        }
      };
      
      // Track catalog downloads
      window.trackCatalogDownload = () => {
        if (window.gtag) {
          window.gtag('event', 'catalog_download', {
            currency: 'NPR',
            value: 500
          });
        }
      };
    };
    
    // Initialize analytics only in production
    if (process.env.NODE_ENV === 'production') {
      // Uncomment the following lines when you have actual tracking IDs
      // loadGA4();
      // addSearchConsoleVerification();
      // loadFacebookPixel();
    }
    
    trackCustomEvents();
    
    // Track initial page view
    trackPageView();
    
    // Listen for route changes in React Router
    const handleRouteChange = () => {
      setTimeout(() => trackPageView(), 100);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  return null;
};

export default SEOAnalytics;
