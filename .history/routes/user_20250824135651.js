const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/userController');
const clerkAuth = require('../middleware/auth');

router.get('/profile', clerkAuth, (req, res) => {
  res.json({ user: req.user });
});router.post('/address', auth, ctrl.addAddress);
router.get('/wishlist', auth, ctrl.getWishlist);
router.post('/wishlist', auth, ctrl.addWishlist);
router.delete('/wishlist/:productId', auth, ctrl.removeWishlist);

module.exports = router;
