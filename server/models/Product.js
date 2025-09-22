const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Note: Price removed as per user request - no pricing in admin panel
  description: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory'
  },
  // Legacy fields for compatibility - will be populated from references
  category: {
    type: String
  },
  subcategory: {
    type: String
  },
  
  // Enhanced product details
  features: [{
    type: String
  }],
  specifications: [{
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  deliveryInformation: {
    estimatedDelivery: {
      type: String,
      default: "7-10 business days"
    },
    shippingCost: {
      type: String,
      default: "Free shipping"
    },
    availableLocations: [{
      type: String
    }],
    specialInstructions: {
      type: String
    }
  },
  
  // Image fields
  image: {
    type: String,
    required: true,
    alias: 'mainImage'
  },
  images: [{
    type: String
  }], // This will store the 3 sub images
  
  // Product categorization for homepage
  isMostSelling: {
    type: Boolean,
    default: false
  },
  isTopProduct: {
    type: Boolean,
    default: false
  },
  
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  material: String,
  colors: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  featured: {
    type: Boolean,
    default: false
  },
  salesCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 100
  }
});

// Create indexes for common query patterns
ProductSchema.index({ categoryId: 1 }); // For filtering by category
ProductSchema.index({ subcategoryId: 1 }); // For filtering by subcategory
ProductSchema.index({ name: 'text', description: 'text' }); // Text search index
ProductSchema.index({ dateAdded: -1 }); // For sorting by date
ProductSchema.index({ isAvailable: 1 }); // For filtering by availability
ProductSchema.index({ featured: 1 }); // For filtering featured products
ProductSchema.index({ salesCount: -1 }); // For sorting by sales count
ProductSchema.index({ rating: -1 }); // For sorting by rating
ProductSchema.index({ isMostSelling: 1 }); // For filtering most selling products
ProductSchema.index({ isTopProduct: 1 }); // For filtering top products

// Pre-save hook to ensure category and subcategory string fields are populated
ProductSchema.pre('save', async function(next) {
  try {
    // If categoryId exists but category string is not set
    if (this.categoryId && !this.category) {
      const Category = mongoose.model('Category');
      const categoryDoc = await Category.findById(this.categoryId);
      if (categoryDoc) {
        this.category = categoryDoc.name;
      }
    }
    
    // If subcategoryId exists but subcategory string is not set
    if (this.subcategoryId && !this.subcategory) {
      const Subcategory = mongoose.model('Subcategory');
      const subcategoryDoc = await Subcategory.findById(this.subcategoryId);
      if (subcategoryDoc) {
        this.subcategory = subcategoryDoc.name;
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', ProductSchema);
