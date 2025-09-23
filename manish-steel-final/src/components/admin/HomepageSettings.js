import React, { useState, useEffect, useRef } from 'react';
import { PhotoIcon, CloudArrowUpIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import homePageImage from '../../assets/home-page-1.png';

const HomepageSettings = () => {
  const [heroImage, setHeroImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ show: false, success: false, message: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  // Load current settings on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('homepageSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setHeroImage(settings.heroImage || '');
    } else {
      // Set default image path
      setHeroImage(homePageImage);
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showMessage('Please select a valid image file.', false);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('Image size must be less than 5MB.', false);
      return;
    }

    setIsUploading(true);

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setPreviewImage(imageUrl);
      setHeroImage(imageUrl);
      setIsUploading(false);
      showMessage('Image uploaded successfully! Don\'t forget to save changes.', true);
    };
    reader.onerror = () => {
      setIsUploading(false);
      showMessage('Failed to upload image. Please try again.', false);
    };
    reader.readAsDataURL(file);
  };

  // Trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  // Save homepage settings
  const handleSave = async () => {
    try {
      const settings = {
        heroImage: heroImage,
        lastUpdated: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('homepageSettings', JSON.stringify(settings));
      
      // Dispatch custom event to notify homepage about the update
      window.dispatchEvent(new CustomEvent('homepageSettingsUpdated', {
        detail: settings
      }));
      
      // In a real app, you would also send this to your backend API
      // await api.updateHomepageSettings(settings);

      showMessage('Homepage settings saved successfully!', true);
    } catch (error) {
      console.error('Error saving homepage settings:', error);
      showMessage('Failed to save settings. Please try again.', false);
    }
  };

  // Reset to default image
  const handleReset = () => {
    const defaultImage = homePageImage;
    setHeroImage(defaultImage);
    setPreviewImage(null);
    
    // Update localStorage immediately
    const settings = {
      heroImage: defaultImage,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('homepageSettings', JSON.stringify(settings));
    
    // Dispatch event to notify homepage
    window.dispatchEvent(new CustomEvent('homepageSettingsUpdated', {
      detail: settings
    }));
    
    showMessage('Reset to default image. Changes applied immediately!', true);
  };

  // Show status message
  const showMessage = (message, success) => {
    setSaveStatus({ show: true, success, message });
    setTimeout(() => {
      setSaveStatus(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <PhotoIcon className="w-8 h-8 text-blue-600 mr-3" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Homepage Settings</h2>
          <p className="text-gray-600">Manage your homepage hero section image</p>
        </div>
      </div>

      {/* Status Message */}
      {saveStatus.show && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          saveStatus.success 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {saveStatus.success ? (
            <CheckCircleIcon className="w-5 h-5 mr-2" />
          ) : (
            <XCircleIcon className="w-5 h-5 mr-2" />
          )}
          {saveStatus.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Image Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Current Hero Image</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
            {heroImage ? (
              <div className="relative">
                <img 
                  src={previewImage || heroImage} 
                  alt="Homepage Hero" 
                  className="w-full h-64 object-cover rounded-lg shadow-sm"
                  onError={(e) => {
                    // Fallback to default image if preview fails
                    if (e.target.src !== homePageImage) {
                      e.target.src = homePageImage;
                    }
                    e.target.alt = 'Default preview image';
                  }}
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Active
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <PhotoIcon className="w-16 h-16 mb-4" />
                <p>No image selected</p>
              </div>
            )}
          </div>
          
          {/* Image Information */}
          {heroImage && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-700 mb-2">Image Details</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Path:</span> {heroImage}</p>
                <p><span className="font-medium">Type:</span> Hero Section Image</p>
                <p><span className="font-medium">Recommended Size:</span> 800x600px or larger</p>
              </div>
            </div>
          )}
        </div>

        {/* Upload New Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Upload New Image</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <CloudArrowUpIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Image Guidelines:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Recommended size: 800x600px or larger</li>
                  <li>Format: JPG, PNG, or WebP</li>
                  <li>Max file size: 5MB</li>
                  <li>Show your best furniture collection</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Image Uploader Component */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600">Uploading image...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  JPG, PNG, or WebP up to 5MB
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              Save Changes
            </button>
            
            <button
              onClick={handleReset}
              disabled={isUploading}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PhotoIcon className="w-5 h-5 mr-2" />
              Reset to Default
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">💡 Pro Tips:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Use high-quality images that showcase your furniture clearly</li>
              <li>• Images with good lighting perform better</li>
              <li>• Consider showing multiple furniture pieces in one image</li>
              <li>• Make sure the image aligns with your brand colors</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview on Homepage</h3>
        <div className="bg-gray-100 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                Shree Manish Steel Furniture Industry
              </h4>
              <p className="text-gray-600 mb-4">
                Quality Steel Furniture for Every Space
              </p>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm">
                  Explore Products
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src={previewImage || heroImage} 
                alt="Preview" 
                className="w-full h-40 object-cover rounded-lg shadow"
                onError={(e) => {
                  // Fallback to default image if preview fails
                  if (e.target.src !== homePageImage) {
                    e.target.src = homePageImage;
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageSettings;
