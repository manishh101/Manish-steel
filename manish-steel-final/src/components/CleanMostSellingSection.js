import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire } from 'react-icons/fa';
import { productAPI } from '../services/productService';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import useQuickView from '../hooks/useQuickView';

const CleanMostSellingSection = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView } = useQuickView();

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  // No need for manual quick view handlers - using the hook

  const fetchBestSellingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching best-selling products...');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('API URL:', process.env.REACT_APP_API_URL);
      
      // Try multiple API endpoints for better reliability
      const endpoints = [
        () => productAPI.getMostSellingProducts(6),
        () => productAPI.getAllProducts({ sortBy: 'popularity', limit: 6 }),
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
      
      if (validProducts.length === 0) {
        throw new Error('No valid products found');
      }
      
      console.log('Setting best-selling products:', validProducts.length);
      setBestSellingProducts(validProducts.slice(0, 6)); // Ensure max 6 products
      
    } catch (error) {
      console.error('Error fetching best-selling products:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to load most selling products';
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        errorMessage = 'Network connection issue. Please check your internet connection.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Best-selling products endpoint not found.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Our team has been notified.';
      }
      
      setError(errorMessage);
      
      // Load fallback/sample products when API fails
      console.log('Loading fallback best-selling products...');
      setBestSellingProducts([
        {
          _id: 'bestseller-1',
          name: 'Popular Steel Desk Chair',
          image: '/images/furniture-placeholder.jpg',
          category: 'Office Furniture',
          bestseller: true,
          description: 'Most popular steel desk chair for offices',
          inStock: true,
          salesCount: 150
        },
        {
          _id: 'bestseller-2',
          name: 'Top-Selling Steel Shelf',
          image: '/images/furniture-placeholder.jpg',
          category: 'Storage',
          bestseller: true,
          description: 'Best-selling steel shelf unit',
          inStock: true,
          salesCount: 120
        },
        {
          _id: 'bestseller-3',
          name: 'Hot Steel File Cabinet',
          image: '/images/furniture-placeholder.jpg',
          category: 'Storage',
          bestseller: true,
          description: 'Top-rated steel file cabinet',
          inStock: true,
          salesCount: 95
        },
        {
          _id: 'bestseller-4',
          name: 'Best Steel Work Table',
          image: '/images/furniture-placeholder.jpg',
          category: 'Tables',
          bestseller: true,
          description: 'Most ordered steel work table',
          inStock: true,
          salesCount: 85
        }
      ]);
      setError(null); // Clear error when fallback is loaded
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Most Selling Products</h2>
            <p className="text-gray-600">Our customers' favorite furniture pieces</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 animate-pulse border">
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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Most Selling Products</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchBestSellingProducts}
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaFire className="h-8 w-8 text-orange-500" />
            <h2 className="text-3xl font-bold text-primary">Most Selling Products</h2>
            <FaFire className="h-8 w-8 text-orange-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our customers' absolute favorites! These furniture pieces have earned their spot 
            through exceptional sales performance and outstanding customer satisfaction.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellingProducts.map((product, index) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              variant="bestseller"
              rank={index}
              salesCount={product.salesCount}
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
            to="/products?sortBy=popularity"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-8 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaFire className="h-4 w-4" />
            View All Best Sellers
            <FaArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        variant="bestseller"
      />
    </section>
  );
};

export default CleanMostSellingSection;
