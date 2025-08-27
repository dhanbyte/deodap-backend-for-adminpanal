const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/profile', auth, userController.getProfile);
router.post('/address', auth, userController.addAddress);
router.post('/wishlist', auth, userController.addWishlist);

module.exports = router;
