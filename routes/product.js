/**
 * @file product.js
 * @description Product-related API routes.
 */

const router = require('express').Router();
const ctrl = require('../controllers/productController');
const requireAuth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// --- Public Routes ---

/**
 * @route   GET /api/products
 * @desc    Get a list of all active products with filtering, searching, and pagination.
 * @access  Public
 */
router.get('/', ctrl.list);

/**
 * @route   POST /api/products/by-ids
 * @desc    Get multiple products by their document IDs.
 * @access  Public
 */
router.post('/by-ids', ctrl.getByIds);

/**
 * @route   GET /api/products/:id
 * @desc    Get the details of a single product by its document ID.
 * @access  Public
 */
router.get('/:id', ctrl.details);


// --- Admin-Only Routes ---

/**
 * @route   POST /api/products
 * @desc    Create a new product or multiple products.
 * @access  Private (Admin Only)
 */
router.post('/', requireAuth, isAdmin, ctrl.create);

/**
 * @route   PUT /api/products/:id
 * @desc    Update an existing product.
 * @access  Private (Admin Only)
 */
router.put('/:id', requireAuth, isAdmin, ctrl.update);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product.
 * @access  Private (Admin Only)
 */
router.delete('/:id', requireAuth, isAdmin, ctrl.remove);


module.exports = router;