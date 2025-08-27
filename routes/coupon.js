const router = require('express').Router();
const ctrl = require('../controllers/couponController');
const auth = require('../middleware/auth');

// Create coupon
router.post('/', auth, ctrl.createCoupon);
// Get all coupons
router.get('/', auth, ctrl.getAllCoupons);
// Get single coupon
router.get('/:id', auth, ctrl.getCouponById);
// Update coupon
router.put('/:id', auth, ctrl.updateCoupon);
// Delete coupon
router.delete('/:id', auth, ctrl.deleteCoupon);

module.exports = router;
