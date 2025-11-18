/**
 * Search API Services
 */
import apiClient from './apiClient';

export const searchAPI = {
  /**
   * Search products by query
   * @param {string} query - Search query
   * @param {Object} options - Search options (limit, filters, etc.)
   * @returns {Promise} - Response with search results
   */
  searchProducts: async (query, options = {}) => {
    const params = {
      search: query,
      limit: options.limit || 50,
      page: options.page || 1,
      ...options.filters
    };
    
    return apiClient.get('/products', { params });
  },

  /**
   * Get search suggestions/autocomplete
   * @param {string} query - Partial query for suggestions
   * @param {number} limit - Maximum number of suggestions
   * @returns {Promise} - Response with suggestions
   */
  getSuggestions: async (query, limit = 8) => {
    if (!query || query.trim().length < 2) {
      return { data: { suggestions: [] } };
    }

    try {
      // Get products that match the query
      const response = await apiClient.get('/products/filter', { 
        params: { 
          search: query.trim(),
          limit: limit * 2 // Get more products to generate better suggestions
        } 
      });

      const products = response.data?.products || [];
      
      // Extract unique suggestions from product names, categories, and subcategories
      const suggestions = new Set();
      const queryLower = query.toLowerCase().trim();

      products.forEach(product => {
        // Product name suggestions
        const nameWords = product.name.toLowerCase().split(/\s+/);
        nameWords.forEach(word => {
          if (word.startsWith(queryLower) && word !== queryLower) {
            suggestions.add(word);
          }
        });

        // Category suggestions
        if (product.category && product.category.toLowerCase().includes(queryLower)) {
          suggestions.add(product.category);
        }

        // Subcategory suggestions
        if (product.subcategory && product.subcategory.toLowerCase().includes(queryLower)) {
          suggestions.add(product.subcategory);
        }
      });

      // Convert to array and limit
      const suggestionsList = Array.from(suggestions).slice(0, limit);

      return { 
        data: { 
          suggestions: suggestionsList,
          totalProducts: products.length 
        } 
      };
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return { data: { suggestions: [] } };
    }
  },

  /**
   * Get popular search terms (based on product names and categories)
   * @param {number} limit - Maximum number of popular terms
   * @returns {Promise} - Response with popular terms
   */
  getPopularSearchTerms: async (limit = 10) => {
    try {
      // Get a sample of popular products to extract common terms
      const response = await apiClient.get('/products', { 
        params: { 
          limit: 100,
          sortBy: 'featured' // Get featured/popular products
        } 
      });

      const products = response.data?.products || [];
      
      // Extract common terms
      const termFrequency = new Map();
      
      products.forEach(product => {
        // Count terms from product names
        const nameWords = product.name.toLowerCase().split(/\s+/)
          .filter(word => word.length > 2); // Filter out short words
        
        nameWords.forEach(word => {
          termFrequency.set(word, (termFrequency.get(word) || 0) + 1);
        });

        // Count categories
        if (product.category) {
          const category = product.category.toLowerCase();
          termFrequency.set(category, (termFrequency.get(category) || 0) + 2); // Weight categories higher
        }

        // Count subcategories
        if (product.subcategory) {
          const subcategory = product.subcategory.toLowerCase();
          termFrequency.set(subcategory, (termFrequency.get(subcategory) || 0) + 1.5);
        }
      });

      // Sort by frequency and return top terms
      const popularTerms = Array.from(termFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([term]) => term);

      return { 
        data: { 
          popularTerms,
          totalProducts: products.length 
        } 
      };
    } catch (error) {
      console.error('Error fetching popular terms:', error);
      return { data: { popularTerms: [] } };
    }
  }
};

/**
 * Enhanced search scoring algorithm
 * @param {string} query - Search query
 * @param {Object} product - Product object
 * @returns {number} - Search score (higher is better match)
 */
export const calculateSearchScore = (query, product) => {
  const queryLower = query.toLowerCase().trim();
  const searchTerms = queryLower.split(/\s+/).filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return 0;

  let score = 0;
  let matchedTerms = 0;

  const productName = (product.name || '').toLowerCase();
  const productCategory = (product.category || '').toLowerCase();
  const productSubcategory = (product.subcategory || '').toLowerCase();
  const productDescription = (product.description || '').toLowerCase();

  searchTerms.forEach(term => {
    // Exact name match (highest priority)
    if (productName.includes(term)) {
      score += productName.startsWith(term) ? 100 : 80;
      matchedTerms++;
    }
    
    // Category match (high priority)
    if (productCategory.includes(term)) {
      score += productCategory === term ? 60 : 40;
      matchedTerms++;
    }
    
    // Subcategory match (medium priority)
    if (productSubcategory.includes(term)) {
      score += productSubcategory === term ? 50 : 30;
      matchedTerms++;
    }
    
    // Description match (lower priority)
    if (productDescription.includes(term)) {
      score += 20;
      matchedTerms++;
    }
  });

  // Bonus for matching multiple terms
  if (matchedTerms >= searchTerms.length) {
    score += 30;
  }

  // Bonus for featured/top products
  if (product.isTopProduct || product.featured) {
    score += 10;
  }

  // Bonus for most selling products
  if (product.isMostSelling) {
    score += 15;
  }

  // Penalty if not enough terms matched
  const matchRatio = matchedTerms / searchTerms.length;
  if (matchRatio < 0.5) {
    score *= matchRatio;
  }

  return score;
};

export default searchAPI;
