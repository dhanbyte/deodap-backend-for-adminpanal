const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom product id
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { 
    original: { type: Number, required: true, min: 0 },
    discounted: { type: Number, min: 0 },
    currency: { type: String, default: "₹" }
  },
  image: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock','discontinued'], 
    default: 'active' 
  }
}, { timestamps: true });

productSchema.index({ name: 1, category: 1, brand: 1, tags: 1 });
module.exports = mongoose.model('Product', productSchema);
