const router = require('express').Router();
const searchController = require('../controllers/searchController');

// Get search suggestions with thumbnails
router.get('/suggestions', searchController.searchSuggestions);

// Search products with filters
router.get('/products', searchController.searchProducts);

module.exports = router;
