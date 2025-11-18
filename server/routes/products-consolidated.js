/**
 * Product Routes
 * Consolidated routes for all product-related endpoints
 */
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth-secure').auth;
const productController = require('../controllers/productController');

/**
 * @route   GET api/products/filter
 * @desc    Get products with enhanced filtering
 * @access  Public
 * 
 * NOTE: This route must be defined BEFORE the /:id route to avoid conflicts
 */
router.get('/filter', productController.filterProducts);

/**
 * @route   GET api/products/featured
 * @desc    Get featured/top products
 * @access  Public
 */
router.get('/featured', productController.getFeaturedProducts);

/**
 * @route   GET api/products/best-selling
 * @desc    Get most selling products
 * @access  Public
 */
router.get('/best-selling', productController.getBestSellingProducts);

/**
 * @route   GET api/products/most-selling
 * @desc    Get products marked as most selling (for homepage)
 * @access  Public
 */
router.get('/most-selling', productController.getMostSellingProducts);

/**
 * @route   GET api/products/top-products
 * @desc    Get products marked as top products (for homepage)
 * @access  Public
 */
router.get('/top-products', productController.getTopProducts);

/**
 * @route   GET api/products
 * @desc    Get all products with pagination and basic filtering
 * @access  Public
 */
router.get('/', productController.getAllProducts);

/**
 * @route   GET api/products/:id/images
 * @desc    Get all images for a specific product (optimized for gallery)
 * @access  Public
 * 
 * NOTE: This route must be defined BEFORE the /:id route to avoid conflicts
 */
router.get('/:id/images', productController.getProductImages);

/**
 * @route   GET api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', productController.getProductById);

/**
 * @route   POST api/products
 * @desc    Create a new product
 * @access  Private
 */
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('image', 'Main image is required').not().isEmpty()
  ]
], productController.createProduct);

/**
 * @route   PUT api/products/:id
 * @desc    Update an existing product
 * @access  Private
 */
router.put('/:id', [
  auth,
  [
    check('name', 'Name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty()
  ]
], productController.updateProduct);

/**
 * @route   DELETE api/products/:id
 * @desc    Delete a product
 * @access  Private
 */
router.delete('/:id', auth, productController.deleteProduct);

/**
 * @route   PATCH api/products/:id/featured
 * @desc    Update product featured status
 * @access  Private
 */
router.patch('/:id/featured', auth, productController.updateFeaturedStatus);

/**
 * @route   PATCH api/products/:id/most-selling
 * @desc    Update product most selling status
 * @access  Private
 */
router.patch('/:id/most-selling', auth, productController.updateMostSellingStatus);

/**
 * @route   PATCH api/products/:id/top-product
 * @desc    Update product top product status
 * @access  Private
 */
router.patch('/:id/top-product', auth, productController.updateTopProductStatus);

/**
 * @route   PATCH api/products/:id/category-thumbnail
 * @desc    Update product category thumbnail status
 * @access  Private
 */
router.patch('/:id/category-thumbnail', auth, productController.updateCategoryThumbnailStatus);

/**
 * @route   PATCH api/products/:id/sales
 * @desc    Update product sales count
 * @access  Private
 */
router.patch('/:id/sales', auth, productController.updateSalesCount);

module.exports = router;
