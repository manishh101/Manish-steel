const mongoose = require('mongoose');
const Product = require('../models/Product');

// Simple getAllProducts that works
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const query = {};
    
    // Temporarily disable category filtering
    // if (category) {
    //   query.category = { $regex: category, $options: 'i' };
    // }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort({ dateAdded: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    
    res.json({
      products,
      totalProducts,
      totalPages,
      currentPage: parseInt(page)
    });
    
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Simple filter that redirects to getAllProducts
exports.filterProducts = async (req, res) => {
  return exports.getAllProducts(req, res);
};

// Get most selling products
exports.getMostSellingProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.find({ isMostSelling: true })
      .sort({ dateAdded: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get most selling products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get top products
exports.getTopProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;
    const products = await Product.find({ isTopProduct: true })
      .sort({ dateAdded: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get top products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add placeholder methods for other routes
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(6);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBestSellingProducts = async (req, res) => {
  return exports.getMostSellingProducts(req, res);
};

exports.getProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ images: product.images || [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
