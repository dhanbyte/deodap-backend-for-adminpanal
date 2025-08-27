const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/userController');
router.get('/profile', auth, ctrl.profile);
router.post('/address', auth, ctrl.addAddress);
router.get('/wishlist', auth, ctrl.getWishlist);
router.post('/wishlist', auth, ctrl.addWishlist);
router.delete('/wishlist/:productId', auth, ctrl.removeWishlist);
module.exports = router;
