// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom product id like "P001"
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  extraImage: [{ type: String }],
  video: { type: String },
  material: { type: String },
  size: { type: String },
  height: { type: String },
  width: { type: String },
  description: { type: String },
  
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
