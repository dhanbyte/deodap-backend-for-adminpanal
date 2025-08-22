const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    seller: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    extraImage: [{ type: String }],
    video: { type: String },
    material: { type: String },
    size: { type: String },
    height: { type: String },
    width: { type: String },
    description: { type: String },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);
