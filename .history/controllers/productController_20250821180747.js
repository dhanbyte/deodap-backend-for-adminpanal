const Product = require('../models/Product');

// Get all products or by category
exports.getProducts = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (err) {
        next(err);
    }
};

// Search products by name, seller, or description (regex)
exports.searchProducts = async (req, res, next) => {
    try {
        const q = req.query.q || '';
        const regex = new RegExp(q, 'i'); // case-insensitive
        const products = await Product.find({
            $or: [
                { name: { $regex: regex } },
                { seller: { $regex: regex } },
                { description: { $regex: regex } }
            ]
        });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (err) {
        next(err);
    }
};

// Add new product
exports.addProduct = async (req, res, next) => {
    try {
        const {
            id,
            name,
            seller,
            price,
            quantity,
            image,
            extraImage,
            video,
            material,
            size,
            height,
            width,
            description,
            category
        } = req.body;

        // Basic field validation
        if (!id || !name || !seller || !price || !quantity || !image || !category) {
            return res.status(400).json({ success: false, message: 'Required fields missing.' });
        }

        const product = new Product({
            id,
            name,
            seller,
            price,
            quantity,
            image,
            extraImage,
            video,
            material,
            size,
            height,
            width,
            description,
            category
        });

        await product.save();
        res.status(201).json({ success: true, product });
    } catch (err) {
        // Duplicate ID error
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Product ID must be unique.' });
        }
        next(err);
    }
};

// Update existing product
exports.updateProduct = async (req, res, next) => {
    try {
        const updates = req.body;
        const product = await Product.findOneAndUpdate(
            { id: req.params.id },
            updates,
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        res.status(200).json({ success: true, product });
    } catch (err) {
        next(err);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findOneAndDelete({ id: req.params.id });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
        res.status(200).json({ success: true, message: 'Product deleted.' });
    } catch (err) {
        next(err);
    }
};
