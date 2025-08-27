/**
 * @file productController.js
 * @description Controller for handling product-related business logic.
 */

const Product = require('../models/Product');

/**
 * @description Create a new product or multiple products.
 * @route POST /api/products
 * @access Private (Admin Only)
 */
exports.create = async (req, res) => {
  try {
    const data = req.body;

    // Handle bulk creation if the request body is an array
    if (Array.isArray(data)) {
      const products = await Product.insertMany(data, { ordered: false });
      return res.status(201).json({ message: "Products created successfully", products });
    }

    // Handle single product creation
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);

  } catch (err) {
    // Handle potential errors, such as duplicate keys
    if (err.code === 11000) {
      return res.status(400).json({ message: "A product with this ID or SKU already exists." });
    }
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Server error while creating product.' });
  }
};

/**
 * @description Get a list of products with filtering, searching, and pagination.
 * @route GET /api/products
 * @access Public
 */
exports.list = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, q, page = 1, limit = 24 } = req.query;
    const filter = { status: 'active' };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter["price.original"] = {};
      if (minPrice) filter["price.original"].$gte = Number(minPrice);
      if (maxPrice) filter["price.original"].$lte = Number(maxPrice);
    }
    // Search query `q` looks for matches in name, brand, category, tags, and description
    if (q) {
      const searchRegex = new RegExp(q, 'i');
      filter.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { description: searchRegex }
      ];
    }

    const products = await Product.find(filter)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.status(200).json({ 
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalProducts: count,
      products 
    });

  } catch (err) {
    console.error('Error listing products:', err);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

/**
 * @description Get multiple products by their document IDs.
 * @route POST /api/products/by-ids
 * @access Public
 */
exports.getByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid input: 'ids' must be an array." });
    }
    const products = await Product.find({ '_id': { $in: ids } });
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products by IDs:', err);
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
};

/**
 * @description Get the details of a single product.
 * @route GET /api/products/:id
 * @access Public
 */
exports.details = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product details:', err);
    res.status(500).json({ message: 'Server error while fetching product details.' });
  }
};

/**
 * @description Update an existing product.
 * @route PUT /api/products/:id
 * @access Private (Admin Only)
 */
exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Server error while updating product.' });
  }
};

/**
 * @description Delete a product.
 * @route DELETE /api/products/:id
 * @access Private (Admin Only)
 */
exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
};