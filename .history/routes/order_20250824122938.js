const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/orderController');
router.post('/', auth, ctrl.placeOrder);
router.get('/my', auth, ctrl.myOrders);
module.exports = router;
