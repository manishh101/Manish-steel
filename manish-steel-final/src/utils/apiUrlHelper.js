/**
 * API URL Utility
 * 
 * This utility ensures that API URLs are properly formatted and provides
 * fallback mechanisms to improve the robustness of API connections.
 */

/**
 * Sanitize an API URL to ensure proper formatting
 * @param {string} url - The URL to sanitize
 * @returns {string} - The sanitized URL
 */
export const sanitizeApiUrl = (url) => {
  if (!url) return '';
  
  let cleanUrl = url.trim();
  
  // Ensure URL has proper protocol
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    // Fix malformed protocols like "https//" to "https://" or "http//" to "http://"
    if (cleanUrl.startsWith('https:/')) {
      cleanUrl = 'https://' + cleanUrl.substring(7);
    } else if (cleanUrl.startsWith('http:/')) {
      cleanUrl = 'http://' + cleanUrl.substring(6);
    } else if (cleanUrl.startsWith('https/')) {
      cleanUrl = 'https://' + cleanUrl.substring(6);
    } else if (cleanUrl.startsWith('http/')) {
      cleanUrl = 'http://' + cleanUrl.substring(5);
    } else {
      // Use https by default unless explicitly on localhost
      if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
        cleanUrl = 'http://' + cleanUrl;
      } else {
        cleanUrl = 'https://' + cleanUrl;
      }
    }
  }
  
  // Fix multiple consecutive slashes in the path (but preserve protocol slashes)
  // Split by protocol to preserve '://'
  const protocolMatch = cleanUrl.match(/^(https?:\/\/)/);
  if (protocolMatch) {
    const protocol = protocolMatch[1];
    const rest = cleanUrl.substring(protocol.length);
    // Replace multiple slashes with single slash in the path part only
    const cleanRest = rest.replace(/\/+/g, '/');
    cleanUrl = protocol + cleanRest;
  }
  
  // Remove trailing slash if present
  if (cleanUrl.endsWith('/')) {
    cleanUrl = cleanUrl.slice(0, -1);
  }
  
  return cleanUrl;
};

/**
 * Get the base API URL for the current environment
 * @returns {string} - The appropriate base API URL
 */
export const getBaseApiUrl = () => {
  // In production, use the environment variable
  if (process.env.NODE_ENV === 'production') {
    return sanitizeApiUrl(process.env.REACT_APP_API_URL || 'https://manish-steel-api.onrender.com/api');
  }
  
  // In development, start with localhost
  return sanitizeApiUrl('http://localhost:5000/api');
};

/**
 * Get the URL for a specific API endpoint
 * @param {string} endpoint - The endpoint to get the URL for (without leading slash)
 * @returns {string} - The full URL for the endpoint
 */
export const getApiEndpointUrl = (endpoint) => {
  const baseUrl = getBaseApiUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

/**
 * Get the API health check URL
 * @returns {string} - The URL for the health check endpoint
 */
export const getApiHealthUrl = () => {
  // Special case for health endpoint, which is at the root, not under /api
  const baseUrl = getBaseApiUrl();
  const rootUrl = baseUrl.replace(/\/api\/?$/, '');
  return `${rootUrl}/health`;
};

export default {
  sanitizeApiUrl,
  getBaseApiUrl,
  getApiEndpointUrl,
  getApiHealthUrl
};
