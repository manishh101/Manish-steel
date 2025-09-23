// Production error suppression utility
// Prevents Google Maps API debugging errors from showing in production console

export const suppressGoogleMapsErrors = () => {
  if (process.env.NODE_ENV !== 'production') {
    return; // Only suppress in production
  }

  // Override console.error to filter out Google Maps debug messages
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const message = args[0];
    
    // List of Google Maps related errors to suppress
    const googleMapsErrorPatterns = [
      'maps.googleapis.com/maps/api/mapsjs/gen_204',
      'ERR_BLOCKED_BY_CLIENT',
      'csp_test=true',
      'google.maps.Load',
      'Google Maps JavaScript API',
      'maps.gstatic.com',
      'net::ERR_BLOCKED_BY_CLIENT'
    ];
    
    if (typeof message === 'string') {
      const shouldSuppress = googleMapsErrorPatterns.some(pattern => 
        message.includes(pattern)
      );
      
      if (shouldSuppress) {
        return; // Don't log this error
      }
    }
    
    // Log all other errors normally
    originalConsoleError.apply(console, args);
  };

  // Also suppress network errors related to Google Maps
  const originalConsoleWarn = console.warn;
  console.warn = function(...args) {
    const message = args[0];
    
    if (typeof message === 'string' && (
      message.includes('maps.googleapis.com') ||
      message.includes('ERR_BLOCKED_BY_CLIENT') ||
      message.includes('csp_test')
    )) {
      return; // Don't log this warning
    }
    
    originalConsoleWarn.apply(console, args);
  };
};

// Initialize error suppression
suppressGoogleMapsErrors();
