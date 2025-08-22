// controllers/productController.js

const Product = require('../models/Product');

// Get all products, optionally by category
exports.getProducts = async (req, res, next) => {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// Search products by name, seller, description
exports.searchProducts = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      $or: [
        { name: regex },
        { seller: regex },
        { description: regex }
      ]
    });
    res.status(200).json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
};

// Add Product
exports.addProduct = async (req, res, next) => {
  try {
    const {
      id, name, seller, price, quantity, image, extraImage,
      video, material, size, height, width, description, category
    } = req.body;
    if (!id || !name || !seller || !price || !quantity || !image || !category) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    // Check for unique id
    const exists = await Product.findOne({ id });
    if (exists) return res.status(400).json({ success: false, message: 'Product ID already exists.' });

    const product = new Product({
      id, name, seller, price, quantity, image, extraImage,
      video, material, size, height, width, description, category
    });
    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Update Product by MongoDB _id
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, // MongoDB ObjectId in _id field
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Delete Product by MongoDB _id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
};
