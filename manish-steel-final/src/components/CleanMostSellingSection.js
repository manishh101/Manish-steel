import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaFire } from 'react-icons/fa';
import { productAPI } from '../services/api';
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

  const fetchBestSellingProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching most selling products from API...');
      
      // Use the correct API method for most selling products
      const response = await productAPI.getMostSelling(6);
      
      console.log('Most selling products API response:', response.data);
      
      if (response && response.data) {
        const products = Array.isArray(response.data) ? response.data : 
                        response.data.products ? response.data.products : [];
        
        console.log('Setting most selling products:', products.length, 'products');
        setBestSellingProducts(products);
      } else {
        console.warn('No most selling products data received');
        setBestSellingProducts([]);
      }
      
    } catch (error) {
      console.error('Error fetching most selling products:', error);
      setError('Failed to load most selling products');
      setBestSellingProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading most selling products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!bestSellingProducts || bestSellingProducts.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No most selling products available at the moment.</p>
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
          <div className="flex items-center justify-center mb-4">
            <FaFire className="text-3xl text-red-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">Most Selling Products</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our customers' favorite steel furniture pieces that combine quality, durability, and style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {bestSellingProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onQuickView={openQuickView}
              variant="bestseller"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            🔥 View All Best Sellers
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {isQuickViewOpen && quickViewProduct && (
        <QuickView
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={closeQuickView}
        />
      )}
    </section>
  );
};

export default CleanMostSellingSection;
