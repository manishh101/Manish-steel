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
      // Use fallback sample products when API fails
      const fallbackProducts = [
        {
          _id: 'sample-1',
          name: '3 Door Steel Wardrobe',
          category: 'Wardrobe',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          price: 25000
        },
        {
          _id: 'sample-2',
          name: 'Office Steel Table',
          category: 'Table',
          image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400',
          price: 15000
        },
        {
          _id: 'sample-3',
          name: 'Single Door Almirah',
          category: 'Almirah',
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          price: 18000
        },
        {
          _id: 'sample-4',
          name: 'Steel Study Chair',
          category: 'Chair',
          image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400',
          price: 8000
        },
        {
          _id: 'sample-5',
          name: 'Double Bed Frame',
          category: 'Bed',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
          price: 22000
        },
        {
          _id: 'sample-6',
          name: 'Kitchen Cabinet',
          category: 'Cabinet',
          image: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?w=400',
          price: 12000
        }
      ];
      setTopProducts(fallbackProducts);
      setError(null); // Don't show error when fallback is used
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
            <FaStar className="text-xl md:text-2xl text-yellow-500 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary">Our Top Products</h2>
          </div>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Premium furniture showcasing our best craftsmanship.
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
