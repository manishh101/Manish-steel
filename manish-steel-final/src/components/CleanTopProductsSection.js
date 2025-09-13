import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { productAPI } from '../services/productService';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import useQuickView from '../hooks/useQuickView';

const CleanTopProductsSection = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView } = useQuickView();

  useEffect(() => {
    fetchTopProducts();
  }, []);

  // No need for manual quick view handlers - using the hook

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching top products...');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      // Try multiple API endpoints for better reliability
      const endpoints = [
        () => productAPI.getTopProducts(6),
        () => productAPI.getAllProducts({ featured: true, limit: 6 }),
        () => productAPI.getAllProducts({ limit: 6 })
      ];
      
      let response = null;
      let lastError = null;
      
      for (const endpoint of endpoints) {
        try {
          console.log('Trying endpoint...');
          response = await endpoint();
          if (response && response.data) {
            console.log('Success with endpoint, response:', response.data);
            break;
          }
        } catch (endpointError) {
          console.warn('Endpoint failed:', endpointError.message);
          lastError = endpointError;
          continue;
        }
      }
      
      if (!response || !response.data) {
        throw lastError || new Error('All API endpoints failed');
      }
      
      // Check response structure and extract products
      const { data } = response;
      let products = [];
      
      // Handle different response structures
      if (data.success && data.products) {
        console.log('Found products in data.products:', data.products.length);
        products = data.products;
      } else if (Array.isArray(data)) {
        console.log('Found products in data array:', data.length);
        products = data;
      } else if (data.products && Array.isArray(data.products)) {
        console.log('Found products in data.products (no success flag):', data.products.length);
        products = data.products;
      } else if (data.data && Array.isArray(data.data)) {
        console.log('Found products in nested data:', data.data.length);
        products = data.data;
      } else {
        console.warn('No products found in response:', data);
        products = [];
      }
      
      // Filter and prepare products
      const validProducts = products.filter(product => 
        product && (product._id || product.id) && product.name
      );
      
      console.log('Valid products found:', validProducts.length);
      console.log('Valid products:', validProducts.map(p => ({ id: p._id || p.id, name: p.name })));
      
      if (validProducts.length === 0) {
        throw new Error('No valid products found');
      }
      
      console.log('Setting top products:', validProducts.length);
      setTopProducts(validProducts.slice(0, 6)); // Ensure max 6 products
      
    } catch (error) {
      console.error('Error fetching top products:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load featured products';
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Network connection issue. Please check your internet connection.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Featured products endpoint not found.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Our team has been notified.';
      }
      
      setError(errorMessage);
      
      // Load fallback/sample products when API fails
      console.log('Loading fallback products...');
      setTopProducts([
        {
          _id: 'fallback-1',
          name: 'Premium Steel Office Chair',
          image: '/images/furniture-placeholder.jpg',
          category: 'Office Furniture',
          featured: true,
          description: 'Ergonomic steel office chair with premium finish',
          inStock: true
        },
        {
          _id: 'fallback-2', 
          name: 'Modern Steel Cabinet',
          image: '/images/furniture-placeholder.jpg',
          category: 'Storage',
          featured: true,
          description: 'Sleek modern steel cabinet for office storage',
          inStock: true
        },
        {
          _id: 'fallback-3',
          name: 'Industrial Steel Table',
          image: '/images/furniture-placeholder.jpg',
          category: 'Tables',
          featured: true,
          description: 'Heavy-duty industrial steel table',
          inStock: true
        },
        {
          _id: 'fallback-4',
          name: 'Steel Storage Rack',
          image: '/images/furniture-placeholder.jpg',
          category: 'Storage',
          featured: true,
          description: 'Multi-tier steel storage rack',
          inStock: true
        },
        {
          _id: 'fallback-5',
          name: 'Executive Steel Desk',
          image: '/images/furniture-placeholder.jpg',
          category: 'Office Furniture',
          featured: true,
          description: 'Executive steel desk with drawers',
          inStock: true
        },
        {
          _id: 'fallback-6',
          name: 'Steel Bookshelf',
          image: '/images/furniture-placeholder.jpg',
          category: 'Storage',
          featured: true,
          description: 'Durable steel bookshelf for offices',
          inStock: true
        }
      ]);
      setError(null); // Clear error when fallback is loaded
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Top Products</h2>
            <p className="text-gray-600">Discover our most popular and highly rated furniture pieces</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded mb-4 w-2/3"></div>
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Our Top Products</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchTopProducts}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Top Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly rated furniture pieces, carefully selected for their 
            exceptional quality, design, and customer satisfaction.
          </p>
        </div>

        {/* Products Grid */}
                {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProducts.map((product, index) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              variant="featured"
              showCategory={true}
              withActions={true}
              onQuickView={openQuickView}
              className="animate-fadeInUp"
              style={{animationDelay: `${0.1 + (index * 0.1)}s`}}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/products?featured=true"
            className="inline-flex items-center gap-3 bg-primary text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary/80 transition-all duration-300 transform hover:scale-105"
          >
            View All Top Products
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        variant="featured"
      />
    </section>
  );
};

export default CleanTopProductsSection;
