import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI, subcategoryAPI, uploadAPI } from '../../services/api';
import { PhotoIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProductFormEnhanced = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    image: '',
    images: [],
    imageFile: null,
    additionalImageFiles: [null, null, null],
    imagePreviews: { main: '', additional: ['', '', ''] },
    features: [],
    specifications: [],
    deliveryInformation: {
      estimatedDelivery: '7-10 business days',
      shippingCost: 'Free shipping',
      availableLocations: [],
      specialInstructions: ''
    },
    dimensions: { length: '', width: '', height: '' },
    material: '',
    colors: [],
    isAvailable: true,
    isMostSelling: false,
    isTopProduct: false,
    featured: false
  });
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load categories and subcategories
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, subcategoriesRes] = await Promise.all([
          categoryAPI.getAll(),
          subcategoryAPI.getAll()
        ]);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
        setSubcategories(Array.isArray(subcategoriesRes.data) ? subcategoriesRes.data : []);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      }
    };
    loadData();
  }, []);
  
  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(sub => sub.categoryId === formData.categoryId);
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, subcategories]);
  
  // Initialize form with product data
  useEffect(() => {
    if (product) {
      console.log('ProductFormEnhanced - Initializing with product:', product);
      
      // Extract proper category and subcategory IDs
      let categoryId = '';
      let subcategoryId = '';
      
      // Handle categoryId - check multiple possible sources
      if (product.categoryId) {
        categoryId = typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId;
      } else if (product.category && typeof product.category === 'object' && product.category._id) {
        categoryId = product.category._id;
      }
      
      // Handle subcategoryId - check multiple possible sources
      if (product.subcategoryId) {
        subcategoryId = typeof product.subcategoryId === 'object' ? product.subcategoryId._id : product.subcategoryId;
      } else if (product.subcategory && typeof product.subcategory === 'object' && product.subcategory._id) {
        subcategoryId = product.subcategory._id;
      }
      
      console.log('ProductFormEnhanced - Extracted IDs:', { 
        categoryId, 
        subcategoryId,
        originalCategoryId: product.categoryId,
        originalSubcategoryId: product.subcategoryId
      });
      
      const newFormData = {
        ...product,
        categoryId: categoryId,
        subcategoryId: subcategoryId,
        features: product.features || [],
        specifications: product.specifications || [],
        colors: product.colors || [],
        dimensions: product.dimensions || { length: '', width: '', height: '' },
        deliveryInformation: product.deliveryInformation || {
          estimatedDelivery: '7-10 business days',
          shippingCost: 'Free shipping',
          availableLocations: [],
          specialInstructions: ''
        },
        images: Array.isArray(product.images) ? product.images : [],
        material: product.material || '',
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        isMostSelling: product.isMostSelling || false,
        isTopProduct: product.isTopProduct || false,
        featured: product.featured || false,
        imageFile: null,
        additionalImageFiles: [null, null, null],
        imagePreviews: {
          main: product.image || '',
          additional: Array.isArray(product.images) ? 
            [product.images[0] || '', product.images[1] || '', product.images[2] || ''] : 
            ['', '', '']
        }
      };
      
      console.log('ProductFormEnhanced - Setting form data:', newFormData);
      setFormData(newFormData);
    } else {
      console.log('ProductFormEnhanced - Initializing for new product');
      // Reset form for new product
      setFormData({
        name: '',
        categoryId: '',
        subcategoryId: '',
        description: '',
        image: '',
        images: [],
        imageFile: null,
        additionalImageFiles: [null, null, null],
        imagePreviews: { main: '', additional: ['', '', ''] },
        features: [],
        specifications: [],
        deliveryInformation: {
          estimatedDelivery: '7-10 business days',
          shippingCost: 'Free shipping',
          availableLocations: [],
          specialInstructions: ''
        },
        dimensions: { length: '', width: '', height: '' },
        material: '',
        colors: [],
        isAvailable: true,
        isMostSelling: false,
        isTopProduct: false,
        featured: false
      });
    }
  }, [product]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      categoryId: e.target.value,
      subcategoryId: ''
    }));
  };

  const handleImageUpload = (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === 'main') {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreviews: { ...prev.imagePreviews, main: previewUrl }
      }));
    } else if (type === 'additional' && index !== null) {
      const newFiles = [...formData.additionalImageFiles];
      newFiles[index] = file;
      
      const newPreviews = [...formData.imagePreviews.additional];
      newPreviews[index] = previewUrl;
      
      setFormData(prev => ({
        ...prev,
        additionalImageFiles: newFiles,
        imagePreviews: { ...prev.imagePreviews, additional: newPreviews }
      }));
    }
  };

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const updateFeature = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData(prev => ({ ...prev, features: updated }));
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      features: prev.features.filter((_, i) => i !== index) 
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({ 
      ...prev, 
      specifications: [...prev.specifications, { label: '', value: '' }] 
    }));
  };

  const updateSpecification = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: updated }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({ 
      ...prev, 
      specifications: prev.specifications.filter((_, i) => i !== index) 
    }));
  };

  const handleDeliveryLocationsChange = (e) => {
    const locations = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      deliveryInformation: { ...prev.deliveryInformation, availableLocations: locations }
    }));
  };

  const handleColorsChange = (e) => {
    const colors = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, colors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      if (!formData.name || !formData.description || !formData.categoryId) {
        setError('Please fill all required fields (Name, Description, and Category)');
        setIsLoading(false);
        return;
      }
      
      if (!product && !formData.imageFile && !formData.imagePreviews.main) {
        setError('At least one main image is required for new products.');
        setIsLoading(false);
        return;
      }
      
      let productData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId || undefined,
        features: formData.features.filter(f => f.trim() !== ''),
        specifications: formData.specifications.filter(s => s.label.trim() !== '' && s.value.trim() !== ''),
        deliveryInformation: formData.deliveryInformation,
        dimensions: formData.dimensions,
        material: formData.material,
        colors: formData.colors,
        isAvailable: formData.isAvailable,
        isMostSelling: formData.isMostSelling,
        isTopProduct: formData.isTopProduct,
        featured: formData.featured,
        image: formData.image || '',
        images: []
      };

      // Upload images if provided
      if (formData.imageFile || formData.additionalImageFiles.some(file => file !== null)) {
        const uploadFormData = new FormData();
        
        if (formData.imageFile) {
          uploadFormData.append('images', formData.imageFile);
        }
        
        formData.additionalImageFiles.forEach((file) => {
          if (file) {
            uploadFormData.append('images', file);
          }
        });
        
        const uploadResponse = await uploadAPI.uploadImages(uploadFormData);
        const uploadedUrls = uploadResponse.data.urls || [];
        
        let urlIndex = 0;
        if (formData.imageFile && uploadedUrls[urlIndex]) {
          productData.image = uploadedUrls[urlIndex];
          urlIndex++;
        }
        
        formData.additionalImageFiles.forEach((file) => {
          if (file && uploadedUrls[urlIndex]) {
            productData.images.push(uploadedUrls[urlIndex]);
            urlIndex++;
          }
        });
      } else if (product) {
        productData.image = formData.image;
        productData.images = Array.isArray(formData.images) ? formData.images : [];
      }

      if (product && product._id) {
        await productAPI.update(product._id, productData);
        setSuccess('Product updated successfully');
      } else {
        await productAPI.create(productData);
        setSuccess('Product created successfully');
      }
      
      setTimeout(() => onSave(), 1000);
      
    } catch (err) {
      console.error('Error saving product:', err);
      let errorMessage = 'Failed to save product';
      if (err.response?.data?.errors) {
        errorMessage = err.response.data.errors.map(e => e.msg).join(', ');
      } else if (err.response?.data?.msg) {
        errorMessage = err.response.data.msg;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        
        {/* Debug Section - Remove in production */}
        {product && (
          <div className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-3 rounded text-xs">
            <strong>Debug Info:</strong> CategoryID: {formData.categoryId} | SubcategoryID: {formData.subcategoryId} | 
            Features: {formData.features.length} | Specs: {formData.specifications.length}
          </div>
        )}
        
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleCategoryChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                name="subcategoryId"
                value={formData.subcategoryId || ''}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!formData.categoryId || filteredSubcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {filteredSubcategories.map((subcategory) => (
                  <option key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Steel, Wood, etc."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Product Image *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'main')}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
              />
              {formData.imagePreviews.main && (
                <img 
                  src={formData.imagePreviews.main} 
                  alt="Main preview" 
                  className="w-20 h-20 object-cover border rounded-md"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images (up to 3)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'additional', index)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                  {formData.imagePreviews.additional[index] && (
                    <img 
                      src={formData.imagePreviews.additional[index]} 
                      alt={`Additional preview ${index + 1}`} 
                      className="w-full h-32 object-cover border rounded-md"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Features</h3>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter product feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Feature</span>
            </button>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Specifications</h3>
          <div className="space-y-3">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={spec.label}
                  onChange={(e) => updateSpecification(index, 'label', e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Specification Label"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Specification Value"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Specification</span>
            </button>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                name="deliveryInformation.estimatedDelivery"
                value={formData.deliveryInformation.estimatedDelivery}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="7-10 business days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Cost
              </label>
              <input
                type="text"
                name="deliveryInformation.shippingCost"
                value={formData.deliveryInformation.shippingCost}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Free shipping"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Delivery Locations
              </label>
              <input
                type="text"
                value={formData.deliveryInformation.availableLocations.join(', ')}
                onChange={handleDeliveryLocationsChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Mumbai, Delhi, Bangalore (comma-separated)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Delivery Instructions
              </label>
              <textarea
                name="deliveryInformation.specialInstructions"
                value={formData.deliveryInformation.specialInstructions}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="3"
                placeholder="Assembly required, fragile item, etc."
              ></textarea>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dimensions (cm)
              </label>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  name="dimensions.length"
                  value={formData.dimensions.length}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Length"
                  min="0"
                />
                <input
                  type="number"
                  name="dimensions.width"
                  value={formData.dimensions.width}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Width"
                  min="0"
                />
                <input
                  type="number"
                  name="dimensions.height"
                  value={formData.dimensions.height}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Height"
                  min="0"
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Colors
              </label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={handleColorsChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Red, Blue, Black, White (comma-separated)"
              />
            </div>
          </div>
        </div>

        {/* Homepage Display Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Homepage Display Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Featured Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isMostSelling"
                name="isMostSelling"
                checked={formData.isMostSelling}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isMostSelling" className="text-sm text-gray-700">
                Most Selling Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isTopProduct"
                name="isTopProduct"
                checked={formData.isTopProduct}
                onChange={handleInputChange}
                className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isTopProduct" className="text-sm text-gray-700">
                Top Product
              </label>
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Status</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="text-sm text-gray-700">
              Product is Available
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
          
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormEnhanced;
