import React, { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../../services/api';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  XMarkIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import OptimizedImage from '../../components/common/OptimizedImage';
import ImageService from '../../services/imageService';
import ProductFormEnhanced from '../../components/admin/ProductFormEnhanced';

const AdminProductsFixed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(1, 1000);
      const products = Array.isArray(response.data) ? response.data : 
                      response.data?.products ? response.data.products : [];
      setProducts(products);
      setLoading(false);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products.');
      setProducts([]);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openAddModal = () => {
    console.log('Opening add modal');
    setEditingProduct(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    console.log('Opening edit modal for product:', product);
    setEditingProduct(product);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSave = () => {
    console.log('Product saved, reloading products');
    loadProducts();
    closeModal();
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(productId);
        await loadProducts();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(`Failed to delete product: ${err.message}`);
      }
    }
  };

  const handleFeaturedToggle = async (productId, currentFeaturedStatus) => {
    try {
      const newFeaturedStatus = !currentFeaturedStatus;
      await productAPI.updateFeaturedStatus(productId, newFeaturedStatus);
      
      setProducts(prev => prev.map(product => 
        product._id === productId 
          ? { ...product, featured: newFeaturedStatus }
          : product
      ));
    } catch (err) {
      console.error('Error updating featured status:', err);
      setError(`Failed to update featured status: ${err.message}`);
    }
  };

  const getCategoryDisplay = (product) => {
    let display = product.category || 'Uncategorized';
    if (product.subcategory) {
      display += ` > ${product.subcategory}`;
    }
    return display;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">Manage Products (Fixed)</h1>
        <button 
          onClick={openAddModal}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center w-full sm:w-auto"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="lg:hidden space-y-3">
            {products.map((product) => (
              <div key={product._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex items-start">
                  <OptimizedImage 
                    src={product.image} 
                    alt={ImageService.getImageAlt(product)} 
                    category={product.category}
                    size="small"
                    className="h-16 w-16 rounded-md object-cover mr-3"
                    lazy={false}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">
                      {getCategoryDisplay(product)}
                    </p>
                    <div className="flex space-x-3 mt-2">
                      <button 
                        onClick={() => openEditModal(product)} 
                        className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)} 
                        className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {products.length === 0 && (
              <div className="bg-white shadow rounded-lg p-4 text-center text-gray-500">
                No products found. Add a new product to get started.
              </div>
            )}
          </div>
          
          {/* Desktop table view */}
          <div className="hidden lg:block bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Homepage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OptimizedImage 
                        src={product.image} 
                        alt={ImageService.getImageAlt(product)} 
                        category={product.category}
                        size="thumbnail"
                        className="h-10 w-10 rounded-md object-cover" 
                        lazy={false}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getCategoryDisplay(product)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleFeaturedToggle(product._id, product.featured)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.featured
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        <StarIcon 
                          className={`h-4 w-4 mr-1 ${product.featured ? 'text-yellow-600' : 'text-gray-400'}`} 
                          fill={product.featured ? 'currentColor' : 'none'}
                        />
                        {product.featured ? 'Featured' : 'Regular'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-1">
                        {product.isMostSelling && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Most Selling</span>}
                        {product.isTopProduct && <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">Top Product</span>}
                        {!product.isMostSelling && !product.isTopProduct && <span className="text-gray-400">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => openEditModal(product)} className="text-primary hover:text-primary/80 mr-3">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No products found. Add a new product to get started.
                    </td>
                  </tr> 
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto my-2">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-lg sm:text-xl font-bold text-primary">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6">
              <ProductFormEnhanced 
                product={editingProduct}
                onSave={handleSave}
                onCancel={closeModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsFixed;
