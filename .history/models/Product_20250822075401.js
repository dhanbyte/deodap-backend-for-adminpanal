const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    seller: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    extraImage: [{ type: String }],
    video: { type: String },
    material: { type: String },
    size: { type: String },
    height: { type: String },
    width: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
