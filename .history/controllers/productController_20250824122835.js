const Product = require('../models/Product');

// Create Product (Admin)
exports.create = async (req, res) => {
  const prod = new Product(req.body);
  await prod.save();
  res.status(201).json(prod);
};

// List/Search/Filter/Pagination
exports.list = async (req, res) => {
  const { category, brand, minPrice, maxPrice, q, page = 1, limit = 24 } = req.query;
  let filter = { status: 'active' };
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (minPrice || maxPrice) {
    filter["price.original"] = {};
    if (minPrice) filter["price.original"].$gte = Number(minPrice);
    if (maxPrice) filter["price.original"].$lte = Number(maxPrice);
  }
  if (q) filter.$or = [
    { name: new RegExp(q, 'i') },
    { brand: new RegExp(q, 'i') },
    { category: new RegExp(q, 'i') },
    { tags: new RegExp(q, 'i') },
    { description: new RegExp(q, 'i') }
  ];
  const products = await Product.find(filter)
    .skip((page-1)*limit).limit(Number(limit))
    .sort({ createdAt: -1 });
  const count = await Product.countDocuments(filter);
  res.json({ count, products });
};

// Product Details
exports.details = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json(prod);
};

// Update Product (Admin)
exports.update = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json(prod);
};

// Delete Product (Admin)
exports.remove = async (req, res) => {
  const prod = await Product.findByIdAndDelete(req.params.id);
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
