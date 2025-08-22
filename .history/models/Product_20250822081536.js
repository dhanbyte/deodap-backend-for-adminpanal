const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom product id like "P001"
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
  category: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
