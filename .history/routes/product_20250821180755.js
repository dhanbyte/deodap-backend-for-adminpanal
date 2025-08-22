const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products (All or by category)
router.get('/', productController.getProducts);

// GET /api/products/search?q=Y (search by name, seller, description)
router.get('/search', productController.searchProducts);

// POST /api/products (Add new)
router.post('/', productController.addProduct);

// PUT /api/products/:id (Update by id)
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id (Delete by id)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
