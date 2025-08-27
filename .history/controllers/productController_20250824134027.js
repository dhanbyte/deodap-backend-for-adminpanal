const Product = require('../models/Product');

// Create Product (single or multiple)
exports.create = async (req, res) => {
  try {
    let data = req.body;

    // If multiple products passed
    if (Array.isArray(data)) {
      data = data.map(p => ({
        ...p,
        id: p.id || "P" + Date.now() + Math.floor(Math.random()*1000) // auto-generate if missing
      }));
      const result = await Product.insertMany(data, { ordered: false });
      return res.status(201).json({ message: "Products created", products: result });
    }

    // If single product
    if (!data.id) data.id = "P" + Date.now() + Math.floor(Math.random()*1000);

    const prod = new Product(data);
    await prod.save();
    res.status(201).json(prod);

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate product ID or SKU" });
    }
    res.status(500).json({ error: err.message });
  }
};

// List/Search/Filter/Pagination
exports.list = async (req, res) => {
  try {
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
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.json({ count, products });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Product Details
exports.details = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ message: "Not found" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Product
exports.update = async (req, res) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!prod) return res.status(404).json({ message: "Not found" });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Product
exports.remove = async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
