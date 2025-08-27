const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/reviewController');
router.post('/', auth, ctrl.addReview);
router.get('/:productId', ctrl.listReviews);
module.exports = router;
