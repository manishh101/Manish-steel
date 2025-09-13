import { useState } from 'react';

/**
 * Custom hook for managing QuickView modal state
 * @returns {Object} - { quickViewProduct, isQuickViewOpen, openQuickView, closeQuickView }
 */
export const useQuickView = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const openQuickView = (product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const isQuickViewOpen = !!quickViewProduct;

  return {
    quickViewProduct,
    isQuickViewOpen,
    openQuickView,
    closeQuickView
  };
};

export default useQuickView;
