import React, { useState } from 'react';
import ProductFormEnhanced from './ProductFormEnhanced';

const AdminProductsTest = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = () => {
    console.log('Product saved successfully');
    closeModal();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Products Test</h1>
      
      <button 
        onClick={openAddModal}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Test Add Product
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[95vh] overflow-y-auto my-2">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">Test Product Form</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>
            
            <div className="p-6">
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

export default AdminProductsTest;
