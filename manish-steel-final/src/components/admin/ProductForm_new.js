import React, { useState, useEffect } from 'react';
import { productAPI, categoryAPI } from '../../services/api';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    subcategoryId: '',
    description: '',
    image: '', // Main image
    images: [], // 3 sub images
    features: [],
    specifications: [],
    deliveryInformation: {
      estimatedDelivery: '7-10 business days',
      shippingCost: 'Free shipping',
      availableLocations: [],
      specialInstructions: ''
    },
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
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
  
  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        const allCategories = response.data;
        
        // Split into parent categories and subcategories
        const parentCats = allCategories.filter(cat => !cat.parentId);
        const subcats = allCategories.filter(cat => cat.parentId);
        
        setCategories(parentCats);
        setSubcategories(subcats);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error loading categories:', err);
      }
    };
    
    loadCategories();
  }, []);
  
  // Update subcategory options when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(
        sub => sub.parentId === formData.categoryId
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [formData.categoryId, subcategories]);
  
  // Initialize form with product data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
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
        isMostSelling: product.isMostSelling || false,
        isTopProduct: product.isTopProduct || false,
        featured: product.featured || false
      });
    }
  }, [product]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties like dimensions.length
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    // Clear subcategory when category changes
    setFormData({
      ...formData,
      categoryId,
      subcategoryId: ''
    });
  };
  
  const handleArrayInputChange = (e) => {
    const { name, value } = e.target;
    const arrayValues = value.split(',').map(item => item.trim()).filter(Boolean);
    
    setFormData({
      ...formData,
      [name]: arrayValues
    });
  };
  
  // Handle specifications (label-value pairs)
  const addSpecification = () => {
    setFormData({
      ...formData,
      specifications: [...formData.specifications, { label: '', value: '' }]
    });
  };

  const updateSpecification = (index, field, value) => {
    const updatedSpecs = [...formData.specifications];
    updatedSpecs[index][field] = value;
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  const removeSpecification = (index) => {
    const updatedSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      specifications: updatedSpecs
    });
  };

  // Handle delivery locations
  const handleDeliveryLocationsChange = (e) => {
    const { value } = e.target;
    const locations = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData({
      ...formData,
      deliveryInformation: {
        ...formData.deliveryInformation,
        availableLocations: locations
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.categoryId || !formData.image) {
        setError('Please fill all required fields (Name, Description, Category, and Main Image)');
        setIsLoading(false);
        return;
      }
      
      // Validate that we have at most 3 sub images
      if (formData.images.length > 3) {
        setError('You can only have up to 3 sub images');
        setIsLoading(false);
        return;
      }
      
      // Prepare product data
      const productData = {
        ...formData,
        images: formData.images.filter(Boolean) // Remove empty entries
      };
      
      // Save product (create or update)
      if (product && product._id) {
        await productAPI.update(product._id, productData);
        setSuccess('Product updated successfully');
      } else {
        await productAPI.create(productData);
        setSuccess('Product created successfully');
      }
      
      // Notify parent component
      onSave();
      
    } catch (err) {
      setError('Error saving product: ' + (err.response?.data?.msg || err.message));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        
        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium mb-1">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleCategoryChange}
            className="w-full border rounded px-3 py-2"
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
        
        {/* Subcategory */}
        <div>
          <label htmlFor="subcategoryId" className="block text-sm font-medium mb-1">
            Subcategory
          </label>
          <select
            id="subcategoryId"
            name="subcategoryId"
            value={formData.subcategoryId || ''}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
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
        
        {/* Main Image */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Main Image URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {/* Material */}
        <div>
          <label htmlFor="material" className="block text-sm font-medium mb-1">
            Material
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Steel, Wood, etc."
          />
        </div>
        
        {/* Availability */}
        <div>
          <label htmlFor="isAvailable" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="isAvailable"
            name="isAvailable"
            value={formData.isAvailable}
            onChange={e => setFormData({...formData, isAvailable: e.target.value === 'true'})}
            className="w-full border rounded px-3 py-2"
          >
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </div>
        
        {/* Dimensions */}
        <div className="md:col-span-2 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="dimensions.length" className="block text-sm font-medium mb-1">
              Length (cm)
            </label>
            <input
              type="number"
              id="dimensions.length"
              name="dimensions.length"
              value={formData.dimensions.length}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="dimensions.width" className="block text-sm font-medium mb-1">
              Width (cm)
            </label>
            <input
              type="number"
              id="dimensions.width"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="dimensions.height" className="block text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="dimensions.height"
              name="dimensions.height"
              value={formData.dimensions.height}
              onChange={handleInputChange}
              className="w-full border rounded px-3 py-2"
              min="0"
            />
          </div>
        </div>
        
        {/* Description - Full width */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Product Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
            required
          ></textarea>
        </div>
        
        {/* Colors - comma separated */}
        <div className="md:col-span-2">
          <label htmlFor="colors" className="block text-sm font-medium mb-1">
            Available Colors (comma-separated)
          </label>
          <input
            type="text"
            id="colors"
            name="colors"
            value={formData.colors.join(', ')}
            onChange={handleArrayInputChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Red, Blue, Black, White"
          />
        </div>
        
        {/* Features - comma separated */}
        <div className="md:col-span-2">
          <label htmlFor="features" className="block text-sm font-medium mb-1">
            Product Features (comma-separated)
          </label>
          <textarea
            id="features"
            name="features"
            value={formData.features.join(', ')}
            onChange={handleArrayInputChange}
            className="w-full border rounded px-3 py-2"
            rows="3"
            placeholder="Durable, Waterproof, Easy to clean, Modern design"
          ></textarea>
        </div>
        
        {/* Specifications - dynamic label-value pairs */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Product Specifications
          </label>
          {formData.specifications.map((spec, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={spec.label}
                onChange={e => updateSpecification(index, 'label', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Specification Label (e.g., Weight)"
              />
              <input
                type="text"
                value={spec.value}
                onChange={e => updateSpecification(index, 'value', e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Specification Value (e.g., 25 kg)"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSpecification}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Specification
          </button>
        </div>
        
        {/* Delivery Information - Full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-3">
            Delivery Information
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deliveryInformation.estimatedDelivery" className="block text-sm font-medium mb-1">
                Estimated Delivery Time
              </label>
              <input
                type="text"
                id="deliveryInformation.estimatedDelivery"
                name="deliveryInformation.estimatedDelivery"
                value={formData.deliveryInformation.estimatedDelivery}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="7-10 business days"
              />
            </div>
            <div>
              <label htmlFor="deliveryInformation.shippingCost" className="block text-sm font-medium mb-1">
                Shipping Cost
              </label>
              <input
                type="text"
                id="deliveryInformation.shippingCost"
                name="deliveryInformation.shippingCost"
                value={formData.deliveryInformation.shippingCost}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Free shipping"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="deliveryInformation.availableLocations" className="block text-sm font-medium mb-1">
                Available Delivery Locations (comma-separated)
              </label>
              <input
                type="text"
                id="deliveryInformation.availableLocations"
                name="deliveryInformation.availableLocations"
                value={formData.deliveryInformation.availableLocations.join(', ')}
                onChange={handleDeliveryLocationsChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Mumbai, Delhi, Bangalore, Chennai"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="deliveryInformation.specialInstructions" className="block text-sm font-medium mb-1">
                Special Delivery Instructions
              </label>
              <textarea
                id="deliveryInformation.specialInstructions"
                name="deliveryInformation.specialInstructions"
                value={formData.deliveryInformation.specialInstructions}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                rows="2"
                placeholder="Assembly required, fragile item, etc."
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Homepage Selection Flags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-3">
            Homepage Display Options
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={e => setFormData({...formData, featured: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="featured" className="text-sm">
                Featured Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isMostSelling"
                name="isMostSelling"
                checked={formData.isMostSelling}
                onChange={e => setFormData({...formData, isMostSelling: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isMostSelling" className="text-sm">
                Most Selling Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isTopProduct"
                name="isTopProduct"
                checked={formData.isTopProduct}
                onChange={e => setFormData({...formData, isTopProduct: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isTopProduct" className="text-sm">
                Top Product
              </label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            These options control where the product appears on the homepage
          </p>
        </div>

        {/* Sub Images - up to 3 */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Additional Product Images (up to 3)
          </label>
          {[0, 1, 2].map((index) => (
            <div key={index} className="mb-2">
              <input
                type="url"
                value={formData.images[index] || ''}
                onChange={(e) => {
                  const newImages = [...formData.images];
                  if (e.target.value) {
                    newImages[index] = e.target.value;
                  } else {
                    newImages.splice(index, 1);
                  }
                  setFormData({...formData, images: newImages});
                }}
                className="w-full border rounded px-3 py-2"
                placeholder={`Additional Image ${index + 1} URL`}
              />
            </div>
          ))}
          <p className="text-xs text-gray-500 mt-2">
            Enter direct URLs to images for the product gallery. These will be shown alongside the main image in the product details.
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
