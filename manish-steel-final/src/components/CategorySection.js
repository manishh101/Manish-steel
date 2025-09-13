import React from 'react';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import useQuickView from '../hooks/useQuickView';

const CategorySection = ({ title, description, products }) => {
  const { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView } = useQuickView();

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-primary mb-3">{title}</h2>
      {description && (
        <p className="text-text/80 mb-6">{description}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            product={{
              _id: product.id || index,
              name: product.title,
              image: product.image,
              description: product.description,
              category: product.category || 'Furniture'
            }}
            onQuickView={openQuickView}
            withActions={true}
            showCategory={true}
            variant="standard"
          />
        ))}
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

export default CategorySection;
