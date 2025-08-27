const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, trim: true },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, default: 0, min: 0 },
  price: { original: Number, discounted: Number, currency: { type: String, default: "₹"} },
  image: { type: String, required: true },
  description: String,
  tags: [String],
  status: { type: String, default: 'active', enum: ['active', 'inactive', 'out_of_stock', 'discontinued'] }
}, { timestamps: true });
productSchema.index({ name: 1, category: 1, brand: 1, tags: 1 });
module.exports = mongoose.model('Product', productSchema);
