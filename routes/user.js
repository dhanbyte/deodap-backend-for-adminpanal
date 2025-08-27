/**
 * @file user.js
 * @description User-related API routes.
 */

const router = require('express').Router();
const requireAuth = require('../middleware/auth'); // Using the new Clerk middleware
const isAdmin = require('../middleware/isAdmin');
const ctrl = require('../controllers/userController');

// --- Admin Routes ---

/**
 * @route   GET /api/user
 * @desc    Get a list of all users.
 * @access  Private (Admin Only)
 */
router.get('/', requireAuth, isAdmin, ctrl.listAllUsers);


// --- Authenticated User Routes ---

/**
 * @route   GET /api/user/profile
 * @desc    Get the profile of the currently logged-in user.
 *          Also handles syncing the user from Clerk to the local DB.
 * @access  Private
 */
router.get('/profile', requireAuth, ctrl.getProfile);

/**
 * @route   POST /api/user/address
 * @desc    Add a new shipping address to the user's profile.
 * @access  Private
 */
router.post('/address', requireAuth, ctrl.addAddress);

/**
 * @route   GET /api/user/wishlist
 * @desc    Get the user's wishlist.
 * @access  Private
 */
router.get('/wishlist', requireAuth, ctrl.getWishlist);

/**
 * @route   POST /api/user/wishlist
 * @desc    Add a product to the user's wishlist.
 * @access  Private
 */
router.post('/wishlist', requireAuth, ctrl.addToWishlist);

/**
 * @route   DELETE /api/user/wishlist/:productId
 * @desc    Remove a product from the user's wishlist.
 * @access  Private
 */
router.delete('/wishlist/:productId', requireAuth, ctrl.removeFromWishlist);


module.exports = router;