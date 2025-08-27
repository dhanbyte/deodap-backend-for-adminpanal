/**
 * @file order.js
 * @description Order-related API routes.
 */

const router = require('express').Router();
const requireAuth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const ctrl = require('../controllers/orderController');

/**
 * @route   POST /api/orders
 * @desc    Place a new order.
 * @access  Private
 */
router.post('/', requireAuth, ctrl.placeOrder);

/**
 * @route   GET /api/orders
 * @desc    Get orders. Admins get all orders, users get their own.
 * @access  Private
 */
router.get('/', requireAuth, ctrl.getOrders);

/**
 * @route   GET /api/orders/:orderId
 * @desc    Get a single order by its ID.
 * @access  Private
 */
router.get('/:orderId', requireAuth, ctrl.getOrderById);


// --- Admin-Only Routes ---

/**
 * @route   PUT /api/orders/:orderId/status
 * @desc    Update the status of an order.
 * @access  Private (Admin Only)
 */
router.put('/:orderId/status', requireAuth, isAdmin, ctrl.updateOrderStatus);


module.exports = router;