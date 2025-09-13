import React from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import useQuickView from '../hooks/useQuickView';

// Demo component to showcase all ProductCard variants
const ProductCardDemo = () => {
  const { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView } = useQuickView();
  
  const sampleProduct = {
    _id: '1',
    name: 'Premium Steel Cabinet',
    category: 'Office Furniture',
    description: 'High-quality steel cabinet perfect for modern offices',
    image: '/images/cabinet-sample.jpg',
    inStock: true,
    isNew: true,
    discount: 17,
    salesCount: 150,
    reviewCount: 75,
    stock: 5
  };

  const handleProductView = (productId) => {
    console.log('Product view:', productId);
  };

  const handleProductLike = (product) => {
    console.log('Product liked:', product.name);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">ProductCard Variants Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Standard Variant */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Standard</h3>
          <ProductCard
            product={sampleProduct}
            variant="standard"
            onQuickView={openQuickView}
            onProductLike={handleProductLike}
            showCategory={true}
            withActions={true}
          />
        </div>

        {/* Featured Variant */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Featured</h3>
          <ProductCard
            product={sampleProduct}
            variant="featured"
            onQuickView={openQuickView}
            onProductLike={handleProductLike}
            showCategory={true}
            withActions={true}
          />
        </div>

        {/* Bestseller Variant */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Bestseller</h3>
          <ProductCard
            product={sampleProduct}
            variant="bestseller"
            rank={0}
            salesCount={sampleProduct.salesCount}
            onQuickView={openQuickView}
            onProductLike={handleProductLike}
            showCategory={true}
            withActions={true}
          />
        </div>

        {/* Gallery Variant */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">Gallery</h3>
          <ProductCard
            product={{
              ...sampleProduct,
              src: sampleProduct.image,
              title: sampleProduct.name,
              alt: sampleProduct.name
            }}
            variant="gallery"
            onProductView={handleProductView}
            showCategory={false}
            withActions={false}
          />
        </div>
      </div>

      <div className="mt-12 text-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">ProductCard Consolidation Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Removed Components</h4>
              <ul className="text-sm space-y-1">
                <li>• ProductionTopProductsSection</li>
                <li>• ProductionMostSellingSection</li>
                <li>• SimpleTopProducts</li>
                <li>• backup/ directory (6 files)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">🔄 Refactored Components</h4>
              <ul className="text-sm space-y-1">
                <li>• CleanTopProductsSection</li>
                <li>• CleanMostSellingSection</li>
                <li>• GalleryPage</li>
                <li>• Enhanced ProductCard</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 mb-2">📊 Results</h4>
              <ul className="text-sm space-y-1">
                <li>• ~70% code reduction</li>
                <li>• 4 distinct variants</li>
                <li>• Consistent design</li>
                <li>• Better maintainability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
        variant="standard"
      />
    </div>
  );
};

export default ProductCardDemo;
