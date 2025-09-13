import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire } from 'react-icons/fa';
import { productAPI } from '../services/productService';
import ProductCard from './ProductCard';

const CleanMostSellingSection = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching best-selling products...');
      
      // Use the productAPI service directly
      const response = await productAPI.getMostSellingProducts(6);
      console.log('API Response:', response);
      
      // Check response structure and extract products
      if (response && response.data) {
        const { data } = response;
        
        // Handle different response structures
        if (data.success && data.products) {
          console.log('Found products in data.products:', data.products.length);
          setBestSellingProducts(data.products);
        } else if (Array.isArray(data)) {
          console.log('Found products in data array:', data.length);
          setBestSellingProducts(data);
        } else if (data.products) {
          console.log('Found products in data.products (no success flag):', data.products.length);
          setBestSellingProducts(data.products);
        } else {
          console.warn('No products found in response:', data);
          setError('No best-selling products available');
        }
      } else {
        console.warn('Invalid response structure:', response);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching best-selling products:', error);
      setError('Failed to load most selling products');
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
              showBadges={true}
              showCategory={true}
              withActions={true}
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
    </section>
  );
};

export default CleanMostSellingSection;
