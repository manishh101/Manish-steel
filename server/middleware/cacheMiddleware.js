/**
 * Cache Middleware for API Responses
 * Implements in-memory caching to reduce database queries and improve response times
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  get(key) {
    const data = this.cache.get(key);
    const timestamp = this.timestamps.get(key);
    
    if (!data || !timestamp) {
      return null;
    }

    // Check if data is still valid (default 5 minutes = 300000ms)
    const now = Date.now();
    const age = now - timestamp;
    const maxAge = 300000; // 5 minutes

    if (age > maxAge) {
      // Data is stale, remove it
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return data;
  }

  set(key, data, duration = 300000) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now());
    
    // Set cleanup timeout
    setTimeout(() => {
      this.cache.delete(key);
      this.timestamps.delete(key);
    }, duration);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton cache instance
const cache = new SimpleCache();

/**
 * Cache middleware factory
 * @param {number} duration - Cache duration in milliseconds (default: 5 minutes)
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (duration = 300000) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query parameters
    const key = req.originalUrl || req.url;
    
    // Try to get cached response
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`[CACHE HIT] ${key}`);
      
      // Set cache headers
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(duration / 1000)}`);
      
      return res.json(cachedResponse);
    }

    console.log(`[CACHE MISS] ${key}`);
    
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function(data) {
      // Only cache successful responses (status < 400)
      if (res.statusCode < 400) {
        cache.set(key, data, duration);
        console.log(`[CACHE SET] ${key}`);
      }

      // Set cache headers
      res.setHeader('X-Cache-Status', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(duration / 1000)}`);
      
      // Call original json method
      return originalJson(data);
    };

    next();
  };
};

/**
 * Middleware to clear cache
 */
const clearCache = (req, res, next) => {
  cache.clear();
  console.log('[CACHE] Cache cleared');
  next();
};

/**
 * Get cache statistics
 */
const getCacheStats = (req, res) => {
  const stats = cache.getStats();
  res.json({
    success: true,
    stats: {
      entries: stats.size,
      keys: stats.keys,
      message: `Cache contains ${stats.size} entries`
    }
  });
};

module.exports = {
  cacheMiddleware,
  clearCache,
  getCacheStats,
  cache
};
