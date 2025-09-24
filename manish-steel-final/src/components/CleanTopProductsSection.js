import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import { productAPI } from '../services/api';
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

  const fetchTopProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching top products from API...');
      
      // Use the correct API method for top products
      const response = await productAPI.getTopProducts(6);
      
      console.log('Top products API response:', response.data);
      
      if (response && response.data) {
        const products = Array.isArray(response.data) ? response.data : 
                        response.data.products ? response.data.products : [];
        
        console.log('Setting top products:', products.length, 'products');
        setTopProducts(products);
      } else {
        console.warn('No top products data received');
        setTopProducts([]);
      }
      
    } catch (error) {
      console.error('Error fetching top products:', error);
      setError('Failed to load top products');
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading top products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!topProducts || topProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No top products available at the moment.</p>
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
          <div className="flex items-center justify-center mb-4">
            <FaStar className="text-3xl text-yellow-500 mr-3" />
            <h2 className="text-4xl font-bold text-primary">Our Top Products</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Handpicked premium steel furniture that represents the best of our craftsmanship and design excellence.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-12">
          {topProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onQuickView={openQuickView}
              variant="featured"
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            View All Top Products
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

export default CleanTopProductsSection;
