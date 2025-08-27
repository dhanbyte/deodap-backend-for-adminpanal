const router = require('express').Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/affiliateController');

// User-facing affiliate routes
router.post('/register', auth, ctrl.registerAffiliate);
router.get('/me', auth, ctrl.getAffiliateDashboard);

// Public click tracking route
router.get('/track-click', ctrl.trackAffiliateClick);

// Admin affiliate routes
router.get('/admin', auth, ctrl.getAllAffiliates); // Assuming admin check will be done in middleware or controller
router.put('/admin/:id/commission', auth, ctrl.updateAffiliateCommission); // Assuming admin check

module.exports = router;
