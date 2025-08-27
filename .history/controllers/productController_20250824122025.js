const Product = require('../models/Product');

// 1. Get all products
exports.getProducts = async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: products.length, products });
};

// 2. Search products
exports.searchProducts = async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  const products = await Product.find({
    $or: [{ name: regex }, { brand: regex }, { description: regex }]
  });
  res.json({ success: true, count: products.length, products });
};

// 3. Add Product (admin only)
exports.addProduct = async (req, res) => {
  const {
    id, name, brand, category, quantity, price, image, description, tags
  } = req.body;
  if (!id || !name || !brand || !category || !quantity || !price || !image || !description)
    return res.status(400).json({ success: false, message: 'Missing fields' });

  // Duplicate check
  const exists = await Product.findOne({ id });
  if (exists) return res.status(400).json({ success: false, message: 'ID exists' });

  const product = new Product({ id, name, brand, category, quantity, price, image, tags, description });
  await product.save();
  res.status(201).json({ success: true, product });
};
