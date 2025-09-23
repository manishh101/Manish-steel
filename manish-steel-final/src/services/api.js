import axios from 'axios';
import authService from './authService';
import portDiscovery from './portDiscovery';
import { getCategories as getLocalCategories } from '../utils/categoryData';
import { defaultProducts } from '../utils/productData';
import { sanitizeApiUrl } from '../utils/apiUrlHelper';

// Create an initial Axios instance with the correct baseURL based on environment
const getInitialBaseUrl = () => {
  let baseUrl;
  
  // In production, use the environment variable
  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.REACT_APP_API_URL || 'https://manish-steel-api.onrender.com/api';
  } else {
    // In development, start with localhost
    baseUrl = 'http://localhost:5000/api';
  }
  
  // Use the sanitizeApiUrl utility to ensure proper formatting
  baseUrl = sanitizeApiUrl(baseUrl);
  
  console.log('API Client using base URL:', baseUrl);
  return baseUrl;
};

const api = axios.create({
  baseURL: getInitialBaseUrl(),
  timeout: 30000, // Increased from 5000ms to 30000ms for slower servers
  headers: {
    'Content-Type': 'application/json'
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000
});

// Flag to track API connectivity
let isApiConnected = false;
let connectionCheckInProgress = false;

// Enhanced connection check with retry logic
const checkConnection = async (baseUrl, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Checking API connection (attempt ${i + 1}/${retries}):`, baseUrl);
      const response = await axios.get(`${baseUrl}/health`, { 
        timeout: 15000, // Increased timeout for health check
        retry: 0 // Don't retry health checks
      });
      if (response.status === 200) {
        console.log('✅ API connection successful');
        return true;
      }
    } catch (error) {
      console.warn(`❌ API connection attempt ${i + 1} failed:`, error.message);
      if (i < retries - 1) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  return false;
};

// Discover the API port and update the baseURL with improved error handling
(async () => {
  try {
    connectionCheckInProgress = true;
    console.log('🔍 Discovering API port...');
    const discoveredBaseUrl = await portDiscovery.discoverPort();
    api.defaults.baseURL = discoveredBaseUrl;
    console.log('📡 Updated API base URL to:', discoveredBaseUrl);
    
    // Test the connection with retry logic
    isApiConnected = await checkConnection(discoveredBaseUrl);
    
    if (isApiConnected) {
      console.log('🎉 API connection established successfully');
    } else {
      console.warn('⚠️ API connection failed - will use fallback data');
    }
  } catch (error) {
    console.error('❌ Port discovery failed:', error.message);
    // Use default baseURL if port discovery fails
    isApiConnected = false;
    console.log('🔄 Using default base URL as fallback');
  } finally {
    connectionCheckInProgress = false;
  }
})();

// Enhanced request interceptor with retry logic
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Enhanced response interceptor with retry logic and better error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses with timing
    if (response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error details
    console.error(`❌ API Error: ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, error.message);
    
    // Handle timeout errors with retry
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.warn('⏰ Request timeout detected');
      
      // Retry logic for timeout errors
      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0;
      }
      
      if (originalRequest._retryCount < 2) { // Retry up to 2 times
        originalRequest._retryCount++;
        console.log(`🔄 Retrying request (attempt ${originalRequest._retryCount + 1}/3)...`);
        
        // Increase timeout for retry
        originalRequest.timeout = Math.min(originalRequest.timeout * 1.5, 45000);
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, originalRequest._retryCount) * 1000));
        
        return api(originalRequest);
      } else {
        console.error('🚫 Max retries exceeded for timeout');
        isApiConnected = false; // Mark API as disconnected
      }
    }
    
    // Handle connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ENETUNREACH') {
      console.warn('🔌 Connection error detected, marking API as disconnected');
      isApiConnected = false;
    }
    
    // Handle rate limiting (429 status)
    if (error.response?.status === 429) {
      console.warn('🚫 Rate limit hit, waiting before retry...');
      
      // Extract retry-after header if available
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000; // Default 5 seconds
      
      if (!originalRequest._rateLimitRetry) {
        originalRequest._rateLimitRetry = true;
        
        console.log(`⏳ Waiting ${waitTime}ms before retrying due to rate limit...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        return api(originalRequest);
      }
    }
    
    // Handle token expiration (401 status)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('🔑 Authentication error, attempting token refresh...');
      
      try {
        // Try to refresh the token
        const refreshed = await authService.refreshToken();
        
        if (refreshed) {
          console.log('✅ Token refreshed successfully, retrying request...');
          // Update the token in the request and retry
          originalRequest.headers['Authorization'] = `Bearer ${authService.getToken()}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError.message);
        // If refresh failed, logout the user
        authService.logout();
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API Services
export const authAPI = {
  login: (email, password) => {
    // If the email is a phone number (10 digits), use the admin login endpoint
    if (/^\d{10}$/.test(email)) {
      return api.post('/auth/admin', { phone: email, password });
    } else {
      return api.post('/auth', { email, password });
    }
  },
  getCurrentUser: () => api.get('/auth'),
  register: (userData) => api.post('/users', userData)
};

// Product API Services with enhanced fallback and retry logic
export const productAPI = {
  getAll: async (page = 1, limit = 100, params = {}) => {
    try {
      // Check API connection and try to reconnect if needed
      if (!isApiConnected) {
        console.log('🔄 API not connected, attempting to reconnect...');
        const reconnected = await checkApiConnection(2);
        if (!reconnected) {
          throw new Error('API connection failed after retry');
        }
      }
      
      console.log('📊 Fetching all products:', { page, limit, params });
      const response = await api.get('/products', { 
        params: { page, limit, ...params },
        timeout: 20000 // Specific timeout for this endpoint
      });
      
      console.log(`✅ Fetched ${response.data?.products?.length || response.data?.length || 0} products`);
      return response;
    } catch (error) {
      console.warn('⚠️ Products API failed, using fallback data:', error.message);
      
      // Return a mock response with the default products
      return {
        data: {
          products: defaultProducts,
          currentPage: 1,
          totalPages: 1,
          totalProducts: defaultProducts.length
        }
      };
    }
  },
  
  getById: async (id) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.get(`/products/${id}`);
    } catch (error) {
      console.warn('Using fallback product data for ID:', id, error.message);
      const product = defaultProducts.find(p => p.id === id || p._id === id);
      if (product) {
        return { data: product };
      }
      throw new Error('Product not found in fallback data');
    }
  },
  
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  
  // Enhanced filter endpoint for better category filtering
  getByCategory: async (categoryId, extraParams = {}) => {
    console.log('API: Getting products by category with subcategories via /products/filter endpoint:', { categoryId, extraParams });
    
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }

      // ALWAYS include subcategories when fetching by category
      // This is the key: we ALWAYS want all products from a category and its subcategories
      const params = { 
        category: categoryId,
        includeAllSubcategories: true, // THIS IS THE FIX - always include subcategory products
        limit: extraParams.limit || 100,
        page: extraParams.page || 1
      };

      // Only add specific subcategory filter if explicitly requested (rare case)
      if (extraParams.subcategory && extraParams.includeAllSubcategories === false) {
        params.subcategory = extraParams.subcategory;
        params.includeAllSubcategories = false; // Override to get only specific subcategory
      }

      console.log('API: Calling /products/filter with params:', params);
      
      const response = await api.get('/products/filter', { params });
      
      // Enhanced logging to verify category + subcategory filtering
      const products = response.data?.products || response.data || [];
      console.log('API: Category + subcategories filter response:', {
        category: categoryId,
        totalProducts: Array.isArray(products) ? products.length : 0,
        includeSubcategories: params.includeAllSubcategories,
        sampleProducts: Array.isArray(products) ? products.slice(0, 3).map(p => ({
          name: p.name,
          category: p.category,
          subcategory: p.subcategory
        })) : []
      });
      
      return response;
    } catch (error) {
      console.warn('Category + subcategories API failed, using fallback:', categoryId, error.message);
      
      // FIXED: Enhanced fallback for existing 41 products with ID-based categories
      let filtered = defaultProducts;
      
      if (categoryId && categoryId !== 'all') {
        // Create mapping between category names and IDs used in existing products
        const categoryNameToIdMapping = {
          'Office Furniture': 'office',
          'Household Furniture': 'household', 
          'Commercial Furniture': 'commercial'
        };
        
        // Also create reverse mapping for flexibility
        const categoryIdToNameMapping = {
          'office': 'Office Furniture',
          'household': 'Household Furniture',
          'commercial': 'Commercial Furniture'
        };
        
        // Determine the target category ID for filtering
        let targetCategoryId = categoryId;
        if (categoryNameToIdMapping[categoryId]) {
          targetCategoryId = categoryNameToIdMapping[categoryId];
        }
        
        filtered = filtered.filter(p => {
          const productCategory = p.categoryId || p.category;
          const productSubcategory = p.subcategoryId || p.subcategory;
          
          // FIXED: Direct category ID match for existing products
          if (productCategory === targetCategoryId) return true;
          if (productCategory === categoryId) return true;
          
          // Handle case-insensitive string matches
          if (typeof productCategory === 'string') {
            if (productCategory.toLowerCase() === targetCategoryId.toLowerCase()) return true;
            if (productCategory.toLowerCase() === categoryId.toLowerCase()) return true;
          }
          
          // FIXED: Enhanced subcategory mapping based on actual existing product subcategory IDs
          const categorySubcategoryIdMapping = {
            'office': [
              'desks', 'chairs-office', 'tables-office', 'storage-office', 'filing-cabinets',
              'workstations', 'conference-tables', 'reception-desks', 'cabinets-office', 'shelving-office'
            ],
            'household': [
              'almirahs', 'beds', 'living-room', 'kitchen', 'dining-room', 'wardrobes',
              'sofas', 'dining-tables', 'tv-units', 'bookshelves', 'storage-household'
            ],
            'commercial': [
              'restaurant', 'hotel', 'retail', 'hospitality', 'cafe', 'reception',
              'display-units', 'counters', 'seating-commercial', 'storage-commercial'
            ]
          };
          
          // Include all products from subcategories belonging to this category
          if (productSubcategory && categorySubcategoryIdMapping[targetCategoryId]) {
            const validSubcategoryIds = categorySubcategoryIdMapping[targetCategoryId];
            return validSubcategoryIds.some(validId => 
              productSubcategory === validId ||
              productSubcategory.toLowerCase() === validId.toLowerCase() ||
              productSubcategory.toLowerCase().includes(validId.toLowerCase()) ||
              validId.toLowerCase().includes(productSubcategory.toLowerCase())
            );
          }
          
          return false;
        });
      }
      
      // Only filter by specific subcategory if explicitly requested and includeAllSubcategories is false
      if (extraParams.subcategory && extraParams.includeAllSubcategories === false) {
        filtered = filtered.filter(p => 
          (p.subcategoryId === extraParams.subcategory || p.subcategory === extraParams.subcategory)
        );
      }
      
      console.log(`API: Fallback filtered ${filtered.length} products for category: ${categoryId}`);
      return { data: filtered };
    }
  },

  // NEW: Dedicated method for fetching products by category INCLUDING all subcategories
  // This is what should be used when clicking on categories in the frontend
  getProductsByCategory: async (categoryName, options = {}) => {
    console.log('API: Getting ALL products for category and its subcategories:', categoryName);
    
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }

      const params = { 
        category: categoryName,
        includeAllSubcategories: true, // ALWAYS include subcategory products
        limit: options.limit || 100,
        page: options.page || 1
      };

      console.log('API: Fetching category products with params:', params);
      
      const response = await api.get('/products/filter', { params });
      
      const products = response.data?.products || response.data || [];
      console.log(`API: Successfully fetched ${products.length} products for category "${categoryName}" including subcategories`);
      
      return response;
    } catch (error) {
      console.warn('Category products API failed, using fallback:', categoryName, error.message);
      
      // FIXED: Enhanced fallback for existing products with ID-based system  
      let filtered = defaultProducts;
      
      if (categoryName && categoryName !== 'all') {
        // Create mapping between category names and IDs used in existing products
        const categoryNameToIdMapping = {
          'Office Furniture': 'office',
          'Household Furniture': 'household', 
          'Commercial Furniture': 'commercial'
        };
        
        // Determine the target category ID for filtering
        let targetCategoryId = categoryName;
        if (categoryNameToIdMapping[categoryName]) {
          targetCategoryId = categoryNameToIdMapping[categoryName];
        }
        
        filtered = filtered.filter(p => {
          const productCategory = p.categoryId || p.category;
          const productSubcategory = p.subcategoryId || p.subcategory;
          
          // Direct category match (handle both ID and name based filtering)
          if (productCategory === targetCategoryId || productCategory === categoryName) {
            return true;
          }
          
          // Handle case-insensitive string matches
          if (typeof productCategory === 'string') {
            if (productCategory.toLowerCase() === targetCategoryId.toLowerCase() ||
                productCategory.toLowerCase() === categoryName.toLowerCase()) {
              return true;
            }
          }
          
          // FIXED: Comprehensive subcategory mapping using actual product subcategory IDs
          const categorySubcategoryIdMapping = {
            'office': [
              'desks', 'chairs-office', 'tables-office', 'storage-office', 'filing-cabinets',
              'workstations', 'conference-tables', 'reception-desks', 'cabinets-office', 'shelving-office'
            ],
            'household': [
              'almirahs', 'beds', 'living-room', 'kitchen', 'dining-room', 'wardrobes',
              'sofas', 'dining-tables', 'tv-units', 'bookshelves', 'storage-household'
            ],
            'commercial': [
              'restaurant', 'hotel', 'retail', 'hospitality', 'cafe', 'reception',
              'display-units', 'counters', 'seating-commercial', 'storage-commercial'
            ]
          };
          
          // Include products from subcategories belonging to this category
          if (productSubcategory && categorySubcategoryIdMapping[targetCategoryId]) {
            const validSubcategoryIds = categorySubcategoryIdMapping[targetCategoryId];
            return validSubcategoryIds.some(validId => 
              productSubcategory === validId ||
              productSubcategory.toLowerCase() === validId.toLowerCase() ||
              productSubcategory.toLowerCase().includes(validId.toLowerCase()) ||
              validId.toLowerCase().includes(productSubcategory.toLowerCase())
            );
          }
          
          return false;
        });
      }
      
      console.log(`API: Fallback returned ${filtered.length} products for category: ${categoryName}`);
      return { data: { products: filtered, totalProducts: filtered.length } };
    }
  },

  // getByCategoryAlternative method starts here
  getByCategoryAlternative: async (categoryId, extraParams = {}) => {
    console.log('API: Getting products by alternative filter:', { categoryId, extraParams });
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      
      // ENHANCED: Ensure we're sending the correct parameters to the filter endpoint
      const params = { 
        category: categoryId,
        limit: 100,
        ...extraParams 
      };
      
      // Only add subcategory if it's specified and we're not including all subcategories
      if (extraParams.subcategory && !extraParams.includeAllSubcategories) {
        params.subcategory = extraParams.subcategory;
      }
      
      // Add flag to include all subcategories when filtering by main category only
      if (extraParams.includeAllSubcategories) {
        params.includeAllSubcategories = true;
      }
      
      const response = await api.get('/products/filter', { params });
      
      // Enhanced logging to debug category filtering
      console.log('API: Category filter response:', {
        category: categoryId,
        subcategory: extraParams.subcategory,
        productCount: response.data?.products?.length || (Array.isArray(response.data) ? response.data.length : 0),
        products: response.data?.products || response.data
      });
      
      // Detailed logging to diagnose filtering issues
      if (extraParams.debug) {
        console.log('API detailed response for product filter:', {
          category: categoryId,
          productCount: response.data?.products?.length || (Array.isArray(response.data) ? response.data.length : 0),
          firstProduct: response.data?.products?.[0] || (Array.isArray(response.data) && response.data[0] ? {
            name: response.data[0].name,
            category: response.data[0].category || response.data[0].categoryId
          } : 'none')
        });
      } else {
        console.log('API response for product filter:', response.data);
      }
      
      return response;
    } catch (error) {
      console.warn('Using fallback product data for category:', categoryId, error.message);
      // Filter the default products by category and subcategory
      let filtered = defaultProducts;
      
      if (categoryId && categoryId !== 'all') {
        filtered = filtered.filter(p => p.categoryId === categoryId || p.category === categoryId);
      }
      
      if (extraParams.subcategory) {
        filtered = filtered.filter(p => p.subcategoryId === extraParams.subcategory || p.subcategory === extraParams.subcategory);
      }
      
      return { data: filtered };
    }
  },
  
  search: async (query) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.get('/products', { params: { search: query, limit: 100 } });
    } catch (error) {
      console.warn('Using fallback product data for search:', query, error.message);
      // Search in the default products
      const filtered = defaultProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
      );
      return { data: filtered };
    }
  },

  // Get featured products
  getFeatured: async (limit = 6) => {
    try {
      return await api.get('/products/featured', { params: { limit } });
    } catch (error) {
      console.warn('Error fetching featured products:', error.message);
      throw error; // Let the component handle the error
    }
  },

  // Get best selling products
  getBestSelling: async (limit = 6) => {
    try {
      return await api.get('/products/best-selling', { params: { limit } });
    } catch (error) {
      console.warn('Error fetching best selling products:', error.message);
      throw error; // Let the component handle the error
    }
  },

  // Update featured status
  updateFeaturedStatus: async (id, featured) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.patch(`/products/${id}/featured`, { featured });
    } catch (error) {
      console.warn('Featured status update fallback:', error.message);
      // Simulate successful response for demo
      return { data: { success: true, msg: 'Featured status updated (demo mode)' } };
    }
  },

  // Update sales count
  updateSalesCount: async (id, count) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.patch(`/products/${id}/sales`, { count });
    } catch (error) {
      console.warn('Sales count update fallback:', error.message);
      // Simulate successful response for demo
      return { data: { success: true, msg: 'Sales count updated (demo mode)' } };
    }
  },

  // Get most selling products (for homepage)
  getMostSelling: async (limit = 6) => {
    try {
      return await api.get('/products/most-selling', { params: { limit } });
    } catch (error) {
      console.warn('Error fetching most selling products:', error.message);
      throw error; // Let the component handle the error
    }
  },

  // Get top products (for homepage)
  getTopProducts: async (limit = 6) => {
    try {
      return await api.get('/products/top-products', { params: { limit } });
    } catch (error) {
      console.warn('Error fetching top products:', error.message);
      throw error; // Let the component handle the error
    }
  },

  // Update most selling status
  updateMostSellingStatus: async (id, isMostSelling) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.patch(`/products/${id}/most-selling`, { isMostSelling });
    } catch (error) {
      console.warn('Most selling status update fallback:', error.message);
      // Simulate successful response for demo
      return { data: { success: true, msg: 'Most selling status updated (demo mode)' } };
    }
  },

  // Update top product status
  updateTopProductStatus: async (id, isTopProduct) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.patch(`/products/${id}/top-product`, { isTopProduct });
    } catch (error) {
      console.warn('Top product status update fallback:', error.message);
      // Simulate successful response for demo
      return { data: { success: true, msg: 'Top product status updated (demo mode)' } };
    }
  }
};

// Category API Services with fallback
export const categoryAPI = {
  getAll: async (detailed = false) => {
    try {
      // If API is not connected, try to reconnect once
      if (!isApiConnected) {
        const reconnected = await checkApiConnection(2);
        if (!reconnected) {
          throw new Error('API connection failed after retry');
        }
      }
      
      const response = await api.get('/categories', { params: { detailed } });
      return response;
    } catch (error) {
      console.warn('Using fallback category data:', error.message);
      const localCategories = getLocalCategories();
      return { data: localCategories };
    }
  },
  
  getById: async (id, withSubcategories = false) => {
    try {
      if (!isApiConnected) {
        throw new Error('API not connected');
      }
      return await api.get(`/categories/${id}`, {
        params: { subcategories: withSubcategories }
      });
    } catch (error) {
      console.warn('Using fallback category data for ID:', id, error.message);
      const localCategories = getLocalCategories();
      const category = localCategories.find(c => c.id === id || c._id === id);
      if (category) {
        return { data: category };
      }
      throw new Error('Category not found in fallback data');
    }
  },
  
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Subcategory API Services
export const subcategoryAPI = {
  getAll: () => api.get('/subcategories'),
  getByCategoryId: (categoryId) => api.get('/subcategories', {
    params: { categoryId }
  }),
  getById: (id) => api.get(`/subcategories/${id}`),
  create: (subcategoryData) => api.post('/subcategories', subcategoryData),
  update: (id, subcategoryData) => api.put(`/subcategories/${id}`, subcategoryData),
  delete: (id) => api.delete(`/subcategories/${id}`)
};

// Upload API Service
export const uploadAPI = {
  uploadImages: (formData) => {
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

// Inquiry API Service
export const inquiryAPI = {
  // Get all inquiries with pagination and filtering
  getAll: async (page = 1, limit = 10, status = null, search = null) => {
    try {
      // Get token or refresh if needed
      let token = authService.getToken();
      
      if (!token) {
        await authService.refreshToken();
        token = authService.getToken();
      }

      // Build query parameters
      const params = new URLSearchParams({
        page,
        limit
      });
      
      if (status) {
        params.append('status', status);
      }
      
      if (search) {
        params.append('search', search);
      }
      
      // Make request with proper authorization header
      const response = await api.get(`/inquiries?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        _preventRetry: true
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      // Return empty data instead of throwing
      return {
        data: {
          inquiries: [],
          totalPages: 0,
          currentPage: page,
          totalInquiries: 0
        }
      };
    }
  },
  
  // Get a single inquiry by ID
  getById: async (id) => {
    try {
      return await api.get(`/inquiries/${id}`, {
        _preventRetry: true
      });
    } catch (error) {
      console.error('Error fetching inquiry details:', error);
      throw error;
    }
  },
  
  // Create a new inquiry (from contact form)
  create: async (inquiryData) => {
    try {
      // Basic validation for required fields
      const requiredFields = ['name', 'email', 'phone', 'message'];
      const validCategories = ['product', 'service', 'support', 'business', 'general'];
      const errors = [];
      
      // Check required fields
      for (const field of requiredFields) {
        if (!inquiryData[field] || inquiryData[field].trim() === '') {
          errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
      }
      
      // Set default category if missing
      if (!inquiryData.category || inquiryData.category.trim() === '') {
        inquiryData.category = 'general';
      } else if (!validCategories.includes(inquiryData.category)) {
        inquiryData.category = 'general';
        errors.push('Invalid category');
      }
      
      // Handle validation errors
      if (errors.length > 0) {
        throw new Error(`Please correct the following: ${errors.join(', ')}`);
      }
      
      // Clean input data
      const validatedData = {
        name: inquiryData.name.trim(),
        email: inquiryData.email.trim(),
        phone: inquiryData.phone.trim(),
        message: inquiryData.message.trim(),
        category: inquiryData.category,
      };
      
      // Send inquiry via the API
      const response = await api.post('/inquiries', validatedData);
      return response;
    } catch (error) {
      console.error('Error creating inquiry:', error);
      throw error;
    }
  },
  
  // Update inquiry status
  updateStatus: async (id, status) => {
    try {
      return await api.put(`/inquiries/${id}`, { status }, {
        _preventRetry: true
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      throw error;
    }
  },
  
  // Delete an inquiry
  delete: async (id) => {
    try {
      return await api.delete(`/inquiries/${id}`, {
        _preventRetry: true
      });
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      throw error;
    }
  }
};

// About Page API Service
export const aboutAPI = {
  // Get about page content
  getContent: async () => {
    try {
      const response = await api.get('/about');
      return response;
    } catch (error) {
      console.error('Error fetching about page content:', error);
      // Return default about page content in case of error
      return {
        data: {
          success: true,
          data: null
        }
      };
    }
  },
  
  // Update entire about page content
  updateContent: async (aboutData) => {
    try {
      // Try to get the authentication token
      let headers = {};
      try {
        const token = await authService.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Auth token not available, proceeding without authentication');
      }
      
      const response = await api.put('/about', aboutData, { headers });
      return response;
    } catch (error) {
      console.error('Error updating about page content:', error);
      
      // Provide a structured error response
      if (error.response) {
        // Server responded with an error status
        return error.response;
      } else {
        // Return a formatted error for consistency
        return {
          data: {
            success: false,
            message: error.message || 'Network error occurred',
            error: error
          }
        };
      }
    }
  },
  
  // Update a specific section of the about page
  updateSection: async (section, sectionData) => {
    try {
      // Try to get the authentication token
      let headers = {};
      try {
        const token = await authService.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Auth token not available, proceeding without authentication');
      }
      
      const data = {};
      data[section] = sectionData;
      
      const response = await api.put(`/about/section/${section}`, data, { headers });
      return response;
    } catch (error) {
      console.error(`Error updating ${section} section:`, error);
      throw error;
    }
  },
  
  // Update workshop images
  updateWorkshopImages: async (images) => {
    try {
      // Try to get the authentication token
      let headers = {};
      try {
        const token = await authService.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Auth token not available, proceeding without authentication');
      }
      
      const response = await api.put('/about/workshop-images', { images }, { headers });
      return response;
    } catch (error) {
      console.error('Error updating workshop images:', error);
      throw error;
    }
  },
  
  // Add or update a core value
  updateCoreValue: async (valueId, value) => {
    try {
      // Try to get the authentication token
      let headers = {};
      try {
        const token = await authService.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Auth token not available, proceeding without authentication');
      }
      
      const response = await api.put(`/about/core-value/${valueId}`, { value }, { headers });
      return response;
    } catch (error) {
      console.error('Error updating core value:', error);
      throw error;
    }
  },
  
  // Delete a core value
  deleteCoreValue: async (valueId) => {
    try {
      // Try to get the authentication token
      let headers = {};
      try {
        const token = await authService.getAuthToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.warn('Auth token not available, proceeding without authentication');
      }
      
      const response = await api.delete(`/about/core-value/${valueId}`, { headers });
      return response;
    } catch (error) {
      console.error('Error deleting core value:', error);
      throw error;
    }
  }
};

/**
 * Enhanced API connection check with better retry logic
 * @param {number} retryCount - Number of connection attempts to make
 * @returns {Promise<boolean>} - Whether connection was successful
 */
const checkApiConnection = async (retryCount = 3) => {
  if (connectionCheckInProgress) {
    console.log('⏳ Connection check already in progress, waiting...');
    // Wait for ongoing connection check to complete
    let attempts = 0;
    while (connectionCheckInProgress && attempts < 30) { // Wait up to 30 seconds
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    return isApiConnected;
  }

  connectionCheckInProgress = true;
  
  try {
    for (let i = 0; i < retryCount; i++) {
      try {
        console.log(`🔍 API connection check (attempt ${i + 1}/${retryCount})`);
        
        // Try port discovery first
        const baseUrl = await portDiscovery.discoverPort();
        api.defaults.baseURL = baseUrl;
        
        // Test with health endpoint
        const healthResponse = await axios.get(`${baseUrl}/health`, { 
          timeout: 15000,
          retry: 0 // Don't retry within this call
        });
        
        if (healthResponse.status === 200) {
          console.log('✅ API connection restored');
          isApiConnected = true;
          return true;
        }
      } catch (error) {
        console.warn(`❌ Connection attempt ${i + 1} failed:`, error.message);
        
        if (i < retryCount - 1) {
          // Wait before next attempt with exponential backoff
          const waitTime = Math.min(Math.pow(2, i) * 1000, 10000); // Max 10 seconds
          console.log(`⏳ Waiting ${waitTime}ms before next attempt...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    console.error('🚫 All connection attempts failed');
    isApiConnected = false;
    return false;
  } finally {
    connectionCheckInProgress = false;
  }
};

// Export the API axios instance as default for backward compatibility
export default api;
