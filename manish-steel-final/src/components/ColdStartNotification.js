import React, { useState, useEffect } from 'react';

const ColdStartNotification = () => {
  const [showColdStartWarning, setShowColdStartWarning] = useState(false);
  const [coldStartTimer, setColdStartTimer] = useState(null);

  useEffect(() => {
    // Listen for API requests that might trigger cold start
    const handleApiRequest = () => {
      // Show cold start warning after 3 seconds of loading
      const timer = setTimeout(() => {
        setShowColdStartWarning(true);
      }, 3000);
      
      setColdStartTimer(timer);
    };

    // Listen for successful API responses
    const handleApiSuccess = () => {
      if (coldStartTimer) {
        clearTimeout(coldStartTimer);
        setColdStartTimer(null);
      }
      setShowColdStartWarning(false);
    };

    // Add event listeners for API calls
    window.addEventListener('api-request-start', handleApiRequest);
    window.addEventListener('api-request-success', handleApiSuccess);

    return () => {
      if (coldStartTimer) clearTimeout(coldStartTimer);
      window.removeEventListener('api-request-start', handleApiRequest);
      window.removeEventListener('api-request-success', handleApiSuccess);
    };
  }, [coldStartTimer]);

  if (!showColdStartWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg shadow-lg max-w-sm">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            Server is starting up...
          </p>
          <p className="text-xs text-blue-600">
            This may take 15-30 seconds on first load
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColdStartNotification;
