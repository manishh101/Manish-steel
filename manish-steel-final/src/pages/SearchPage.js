import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { searchAPI, calculateSearchScore } from '../services/searchAPI';
import { productAPI } from '../services/productService';
import ProductCard from '../components/ProductCard';
import EnhancedSearch from '../components/EnhancedSearch';

// Search results page component
const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [noResults, setNoResults] = useState(false);
  
  // Get search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  
  // Enhanced search function that uses real API data
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setTotalResults(0);
      setLoading(false);
      setNoResults(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNoResults(false);
    
    try {
      // Call the backend search API
      const response = await searchAPI.searchProducts(searchQuery, {
        limit: 50,
        sortBy: sortBy === 'relevance' ? undefined : sortBy
      });
      
      let results = response.data?.products || [];
      const total = response.data?.total || results.length;
      
      // If we're sorting by relevance, apply our custom scoring
      if (sortBy === 'relevance' && results.length > 0) {
        results = results.map(product => ({
          ...product,
          searchScore: calculateSearchScore(searchQuery, product)
        })).sort((a, b) => b.searchScore - a.searchScore);
      }
      
      setSearchResults(results);
      setTotalResults(total);
      setNoResults(results.length === 0);
      
    } catch (err) {
      console.error("Search error:", err);
      setError('An error occurred while searching. Please try again.');
      setSearchResults([]);
      setTotalResults(0);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  }, [sortBy]);
  
  // Perform search when query or sort changes
  useEffect(() => {
    setSearchInput(query);
    performSearch(query);
  }, [query, performSearch]);
  
  // Handle new search submission from this page
  const handleSearchSubmit = (newQuery) => {
    if (newQuery !== query) {
      navigate(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Get search suggestions for empty state
  const getSearchSuggestions = () => [
    'almirah', 'wardrobe', 'office desk', 'chair', 'table', 
    'locker', 'steel furniture', 'book cabinet', 'door'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          {/* Page Title and Breadcrumb */}
          <div className="mb-4">
            <nav className="text-sm text-gray-600 mb-2">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800">Search Results</span>
              {query && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-primary font-medium">"{query}"</span>
                </>
              )}
            </nav>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {query ? `Search Results for "${query}"` : 'Search Products'}
            </h1>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <EnhancedSearch
              placeholder="Search steel furniture..."
              className="max-w-2xl"
              onSearchSubmit={handleSearchSubmit}
              showSuggestions={true}
            />
          </div>

          {/* Results Summary and Sort */}
          {query && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Searching...
                  </span>
                ) : (
                  <span>
                    {totalResults > 0 ? (
                      <>Showing <span className="font-semibold">{searchResults.length}</span> of <span className="font-semibold">{totalResults}</span> results</>
                    ) : noResults ? (
                      'No products found'
                    ) : (
                      'Enter a search term to find products'
                    )}
                  </span>
                )}
              </div>

              {!loading && searchResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="category">Category</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search Results Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Searching products...</p>
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && noResults && query && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching "{query}". Try searching with different keywords.
              </p>
              
              {/* Search Suggestions */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 mb-3">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(suggestion)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State (No Query) */}
        {!loading && !query && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search Our Products</h3>
              <p className="text-gray-600 mb-6">
                Find the perfect steel furniture for your home or office.
              </p>
              
              {/* Popular Searches */}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700 mb-3">Popular searches:</p>
                <div className="flex flex-wrap gap-2">
                  {getSearchSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSubmit(suggestion)}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm hover:bg-primary/20 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {!loading && searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {searchResults.map((product, index) => (
              <ProductCard
                key={product._id || product.id || index}
                product={product}
                variant={product.isTopProduct ? 'featured' : product.isMostSelling ? 'bestseller' : 'standard'}
                showCategory={true}
              />
            ))}
          </div>
        )}

        {/* Back to Products Link */}
        {!loading && (
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;