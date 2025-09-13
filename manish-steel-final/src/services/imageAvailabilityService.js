/**
 * Image availability checker and fallback handler
 * Ensures robust image loading across the application
 */

class ImageAvailabilityService {
  static cache = new Map();

  /**
   * Check if an image URL is accessible
   * @param {string} url - The image URL to check
   * @returns {Promise<boolean>} - Whether the image is accessible
   */
  static async checkImageAvailability(url) {
    if (!url) return false;
    
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    try {
      // Create a promise that resolves/rejects based on image load
      const isAvailable = await new Promise((resolve, reject) => {
        const img = new Image();
        const timeoutId = setTimeout(() => {
          reject(new Error('Image load timeout'));
        }, 5000); // 5 second timeout

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          resolve(false);
        };

        img.src = url;
      });

      // Cache the result
      this.cache.set(url, isAvailable);
      return isAvailable;
    } catch (error) {
      console.warn('Error checking image availability:', url, error.message);
      this.cache.set(url, false);
      return false;
    }
  }

  /**
   * Get the best available image URL from a list of options
   * @param {string[]} imageUrls - Array of image URLs to try
   * @param {string} fallbackUrl - Fallback URL if none work
   * @returns {Promise<string>} - The best available image URL
   */
  static async getBestAvailableImage(imageUrls, fallbackUrl = null) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return fallbackUrl;
    }

    // Try each URL in order until we find one that works
    for (const url of imageUrls) {
      if (url && await this.checkImageAvailability(url)) {
        return url;
      }
    }

    // If no URLs work, return the fallback
    return fallbackUrl;
  }

  /**
   * Preload critical images for better performance
   * @param {string[]} imageUrls - Array of image URLs to preload
   */
  static preloadImages(imageUrls) {
    if (!Array.isArray(imageUrls)) return;

    imageUrls.forEach(url => {
      if (url && !this.cache.has(url)) {
        // Start loading the image but don't wait for it
        this.checkImageAvailability(url).catch(() => {
          // Silent fail for preloading
        });
      }
    });
  }

  /**
   * Clear the availability cache
   */
  static clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    const total = this.cache.size;
    const available = Array.from(this.cache.values()).filter(Boolean).length;
    return {
      total,
      available,
      unavailable: total - available,
      hitRate: total > 0 ? (available / total * 100).toFixed(1) + '%' : '0%'
    };
  }
}

export default ImageAvailabilityService;
