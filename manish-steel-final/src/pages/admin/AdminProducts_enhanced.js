import React, { useState, useEffect, useCallback } from 'react';
import { productAPI, categoryAPI } from '../../services/api';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  PlusCircleIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  PhotoIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import ProductForm from '../../components/admin/ProductForm';
import OptimizedImage from '../../components/common/OptimizedImage';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(1, 1000);
      
      const products = Array.isArray(response.data) ? response.data : 
                      response.data?.products ? response.data.products : [];
      
      console.log('Loaded products in admin:', products.length);
      setProducts(products);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setError('');
  };

  const handleSave = () => {
    closeModal();
    loadProducts(); // Reload products after save
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product: ' + error.message);
      }
    }
  };

  const toggleFeatured = async (id, featured) => {
    try {
      await productAPI.updateFeaturedStatus(id, !featured);
      loadProducts();
    } catch (error) {
      console.error('Error updating featured status:', error);
      setError('Failed to update featured status: ' + error.message);
    }
  };

  const toggleMostSelling = async (id, isMostSelling) => {
    try {
      await productAPI.updateMostSellingStatus(id, !isMostSelling);
      loadProducts();
    } catch (error) {
      console.error('Error updating most selling status:', error);
      setError('Failed to update most selling status: ' + error.message);
    }
  };

  const toggleTopProduct = async (id, isTopProduct) => {
    try {
      await productAPI.updateTopProductStatus(id, !isTopProduct);
      loadProducts();
    } catch (error) {
      console.error('Error updating top product status:', error);
      setError('Failed to update top product status: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Products</h2>
        <button
          onClick={openAddModal}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Add Product
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Homepage Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-16 w-16 flex-shrink-0">
                      <OptimizedImage
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                        fallback={<PhotoIcon className="h-16 w-16 text-gray-300" />}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">
                      {product.description?.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.categoryId?.name || product.category || 'Uncategorized'}
                    </div>
                    {product.subcategoryId?.name && (
                      <div className="text-sm text-gray-500">
                        {product.subcategoryId.name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => toggleFeatured(product._id, product.featured)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          product.featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <StarIcon className="w-3 h-3 mr-1" />
                        Featured
                      </button>
                      <button
                        onClick={() => toggleMostSelling(product._id, product.isMostSelling)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isMostSelling ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        Most Selling
                      </button>
                      <button
                        onClick={() => toggleTopProduct(product._id, product.isTopProduct)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isTopProduct ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        Top Product
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <ProductForm
              product={editingProduct}
              onSave={handleSave}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
