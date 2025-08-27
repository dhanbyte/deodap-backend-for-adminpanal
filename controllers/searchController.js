const Product = require('../models/Product');

exports.searchSuggestions = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.json([]);
        }

        const suggestions = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        })
        .select('name image price category') // Only fetch required fields
        .limit(10);

        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { query, category, minPrice, maxPrice, sort } = req.query;
        
        let searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (category) {
            searchQuery.category = category;
        }
        
        if (minPrice || maxPrice) {
            searchQuery.price = {};
            if (minPrice) searchQuery.price.$gte = Number(minPrice);
            if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price_asc') sortOption.price = 1;
        if (sort === 'price_desc') sortOption.price = -1;
        if (sort === 'newest') sortOption.createdAt = -1;

        const products = await Product.find(searchQuery)
            .sort(sortOption)
            .limit(50);

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
