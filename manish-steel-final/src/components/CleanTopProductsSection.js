import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { productAPI } from '../services/productService';
import ProductCard from './ProductCard';

const CleanTopProductsSection = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching top products...');
      
      // Use the productAPI service directly
      const response = await productAPI.getTopProducts(6);
      console.log('API Response:', response);
      
      // Check response structure and extract products
      if (response && response.data) {
        const { data } = response;
        
        // Handle different response structures
        if (data.success && data.products) {
          console.log('Found products in data.products:', data.products.length);
          setTopProducts(data.products);
        } else if (Array.isArray(data)) {
          console.log('Found products in data array:', data.length);
          setTopProducts(data);
        } else if (data.products) {
          console.log('Found products in data.products (no success flag):', data.products.length);
          setTopProducts(data.products);
        } else {
          console.warn('No products found in response:', data);
          setError('No featured products available');
        }
      } else {
        console.warn('Invalid response structure:', response);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching top products:', error);
      setError('Failed to load featured products');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topProducts.length > 0 ? topProducts.map((product, index) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              variant="featured"
              showBadges={true}
              showCategory={true}
              withActions={true}
              className="animate-fadeInUp"
              style={{animationDelay: `${0.1 + (index * 0.1)}s`}}
            />
          )) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No featured products available</p>
            </div>
          )}
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
    </section>
  );
};

export default CleanTopProductsSection;
