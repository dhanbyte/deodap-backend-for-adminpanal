const Product = require('../models/Product');

// Create product (admin)
// POST /api/products
exports.create = async (req, res) => {
  const prod = new Product(req.body);
  await prod.save();
  res.status(201).json(prod);
};

// All products + filter + pagination 
// GET /api/products?category=&brand=&minPrice=&maxPrice=&q=&page=&limit=
exports.list = async (req, res) => {
  const { category, brand, minPrice, maxPrice, q, page = 1, limit = 20 } = req.query;
  let filter = {};
  if(category) filter.category = category;
  if(brand) filter.brand = brand;
  if(minPrice || maxPrice) {
    filter["price.original"] = {};
    if(minPrice) filter["price.original"].$gte = Number(minPrice);
    if(maxPrice) filter["price.original"].$lte = Number(maxPrice);
  }
  if (q) filter.$or = [
    { name: new RegExp(q, 'i') },
    { description: new RegExp(q, 'i') },
    { tags: new RegExp(q, 'i') },
    { brand: new RegExp(q, 'i') }
  ];
  const products = await Product.find(filter)
    .skip((page-1)*limit).limit(Number(limit))
    .sort({ createdAt: -1 });
  res.json(products);
};

// Product Details
// GET /api/products/:id
exports.details = async (req, res) => {
  const prod = await Product.findById(req.params.id);
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json(prod);
};

// Update Product (admin)
// PUT /api/products/:id
exports.update = async (req, res) => {
  const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json(prod);
};

// Delete Product (admin)
// DELETE /api/products/:id
exports.remove = async (req, res) => {
  const prod = await Product.findByIdAndDelete(req.params.id);
  if (!prod) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};
