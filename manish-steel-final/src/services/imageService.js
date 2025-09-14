/**
 * Production-ready Image Service
 * Handles image optimization, fallbacks, and responsive loading
 */
import { 
  productPlaceholderImage, 
  householdFurniturePlaceholderImage, 
  officeProductsPlaceholderImage,
  bedsPlaceholderImage
} from '../utils/productPlaceholders';

class ImageService {
  static getCloudinaryUrl(publicId, transformations = {}) {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwrrja8cz';
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
    
    const {
      width = 800,
      height = 600,
      quality = 'auto:good',
      format = 'auto',
      crop = 'fill'
    } = transformations;
    
    const transformString = `w_${width},h_${height},q_${quality},f_${format},c_${crop}`;
    return `${baseUrl}/${transformString}/${publicId}`;
  }

  // Production-ready Cloudinary placeholder
  static getCloudinaryPlaceholder(category = 'Product') {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwrrja8cz';
    
    // Use Cloudinary's built-in sample image with text overlay - this is guaranteed to exist
    const categoryText = (category || 'Product').replace(/[^a-zA-Z0-9\s]/g, '').trim();
    
    // Simple approach: use a solid color background that's generated dynamically
    // This creates a 600x600 gray rectangle with the category text
    const placeholderUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,h_600,c_fill,b_rgb:f3f4f6/l_text:Arial_36_bold_center:${encodeURIComponent(categoryText)},co_rgb:374151,g_center/v1/sample.jpg`;
    
    console.log('Generated reliable Cloudinary placeholder:', placeholderUrl);
    return placeholderUrl;
  }

  static getOptimizedImageUrl(imageUrl, options = {}) {
    // If no image URL provided, use Cloudinary placeholder
    if (!imageUrl) {
      console.warn('No image URL provided, using Cloudinary placeholder for category:', options.category);
      return this.getCloudinaryPlaceholder(options.category);
    }

    // Clean and normalize the URL
    const cleanUrl = imageUrl.trim();

    // PRIORITY 1: Cloudinary URLs - fix double transformation and missing cloud names
    if (this.isCloudinaryUrl(cleanUrl)) {
      return this.fixCloudinaryUrl(cleanUrl, options);
    }
    
    // PRIORITY 2: Convert all other URLs to Cloudinary for production
    // For production, we want everything to go through Cloudinary
    console.log('Converting non-Cloudinary URL to Cloudinary:', cleanUrl);
    return this.convertToCloudinaryUrl(cleanUrl, options);
  }

  static getApiBaseUrl() {
    // Get the API base URL from environment or fallback to localhost
    return process.env.REACT_APP_API_URL || 
           process.env.REACT_APP_API_BASE_URL || 
           'http://localhost:5000/api';
  }
  
  // Helper to identify placeholder images
  static isPlaceholder(url) {
    return url && url.includes('/placeholders/');
  }

  static isCloudinaryUrl(url) {
    // More comprehensive check for Cloudinary URLs
    return url && (
      url.includes('res.cloudinary.com') || 
      url.includes('cloudinary.com') ||
      // Also match Cloudinary URLs that might be using custom CNAME
      (url.includes('/upload/') && 
       (url.includes('/v1/') || url.includes('/image/') || url.includes('/video/')))
    );
  }

  static enhanceCloudinaryUrl(url, options = {}) {
    const { width = 800, height = 600, quality = 'auto:good' } = options;
    
    // If URL already has transformations, return as-is to avoid double transformation
    if (url.includes('/upload/') && (url.includes('w_') || url.includes('c_'))) {
      console.log('Cloudinary URL already has transformations, returning as-is:', url);
      return url;
    }
    
    // Only add transformations if URL doesn't have them
    if (url.includes('/upload/') && !url.includes('w_')) {
      const transformedUrl = url.replace(
        '/upload/', 
        `/upload/w_${width},h_${height},q_${quality},f_auto,c_fill/`
      );
      console.log('Added transformations to Cloudinary URL:', transformedUrl);
      return transformedUrl;
    }
    
    return url;
  }

  // Fix Cloudinary URLs that have issues
  static fixCloudinaryUrl(url, options = {}) {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwrrja8cz';
    
    // Fix URLs missing cloud name
    if (url.includes('res.cloudinary.com/upload/')) {
      console.log('Fixing Cloudinary URL missing cloud name:', url);
      url = url.replace('res.cloudinary.com/upload/', `res.cloudinary.com/${cloudName}/image/upload/`);
    }
    
    // If already has transformations, return as-is to avoid double transformation
    if (url.includes('w_') && url.includes('h_') && url.includes('q_')) {
      console.log('Cloudinary URL already optimized:', url);
      return url;
    }
    
    // Add transformations if missing
    const { width = 800, height = 600, quality = 'auto:good' } = options;
    
    if (url.includes('/upload/') && !url.includes('w_')) {
      const transformedUrl = url.replace(
        '/upload/', 
        `/upload/w_${width},h_${height},q_${quality},f_auto,c_fill/`
      );
      console.log('Added transformations to Cloudinary URL:', transformedUrl);
      return transformedUrl;
    }
    
    return url;
  }

  // Convert any URL to Cloudinary URL for production
  static convertToCloudinaryUrl(originalUrl, options = {}) {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwrrja8cz';
    const { width = 800, height = 600, quality = 'auto:good' } = options;
    
    // Extract filename or use a generic identifier
    let publicId = 'manish-steel/products/converted-image';
    
    if (originalUrl) {
      // Try to extract meaningful filename
      const urlParts = originalUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      if (filename && filename.includes('.')) {
        const nameWithoutExt = filename.split('.')[0];
        publicId = `manish-steel/products/${nameWithoutExt}`;
      }
    }
    
    // Generate Cloudinary URL
    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},q_${quality},f_auto,c_fill/${publicId}`;
    console.log('Converted to Cloudinary URL:', cloudinaryUrl);
    return cloudinaryUrl;
  }

  static ensurePublicAssetUrl(url) {
    if (!url) return '';
    
    // If it's already an absolute URL or a path starting with /, return as is
    if (url.startsWith('http') || url.startsWith('/')) {
      return url;
    }
    
    // Otherwise, ensure it starts with '/'
    return `/${url}`;
  }

  static getPlaceholderImage(category = 'Product') {
    // Map categories to placeholder images - using imported images
    const categoryMap = {
      'beds': bedsPlaceholderImage,
      'chairs': householdFurniturePlaceholderImage,
      'tables': householdFurniturePlaceholderImage,
      'wardrobes': householdFurniturePlaceholderImage,
      'office-chairs': officeProductsPlaceholderImage,
      'office-desks': officeProductsPlaceholderImage,
      'storage': officeProductsPlaceholderImage,
      'lockers': officeProductsPlaceholderImage,
      'counters': officeProductsPlaceholderImage,
      'display-units': officeProductsPlaceholderImage,
      'filing-cabinets': officeProductsPlaceholderImage,
      'commercial-shelving': officeProductsPlaceholderImage,
      'office-storage': officeProductsPlaceholderImage,
      'wood-products': householdFurniturePlaceholderImage,
      'household-furniture': householdFurniturePlaceholderImage,
      'office-products': officeProductsPlaceholderImage
    };

    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    // Ensure the URL is properly formatted
    return this.ensurePublicAssetUrl(categoryMap[normalizedCategory] || productPlaceholderImage);
  }

  static getResponsiveImageSet(imageUrl, options = {}) {
    const sizes = [400, 800, 1200];
    return sizes.map(size => ({
      url: this.getOptimizedImageUrl(imageUrl, { ...options, width: size, height: size }),
      width: size
    }));
  }

  static generateSrcSet(imageUrl, options = {}) {
    const responsiveSet = this.getResponsiveImageSet(imageUrl, options);
    return responsiveSet.map(img => `${img.url} ${img.width}w`).join(', ');
  }

  static getImageSizes() {
    return "(max-width: 480px) 400px, (max-width: 768px) 600px, (max-width: 1200px) 800px, 1200px";
  }

  static preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  static getImageAlt(product) {
    if (!product) return 'Product image';
    
    const name = product.name || 'Product';
    const category = product.category || '';
    
    return category ? `${name} - ${category}` : name;
  }
}

export default ImageService;
