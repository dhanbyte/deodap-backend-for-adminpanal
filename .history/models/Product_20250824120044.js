// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom product id like "P001"
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { 
    original: { type: Number, required: true, min: 0 },
    discounted: { type: Number, min: 0 },
    currency: { type: String, default: "₹" }
  },
  image: { type: String, required: true },
  extraImages: [{ type: String }],
  video: { type: String },
  specifications: {
    material: { type: String },
    size: { type: String },
    height: { type: String },
    width: { type: String },
    weight: { type: String },
    color: { type: String }
  },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 160 },
  features: [{ type: String }],
  tags: [{ type: String }],
  sku: { type: String, unique: true },
  variants: [{
    color: String,
    size: String,
    price: Number,
    quantity: Number,
    sku: String
  }],
  shipping: {
    weight: Number,
    freeShipping: { type: Boolean, default: false }
  },
  inventory: {
    inStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 10 }
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'], 
    default: 'active' 
  },
  returnPolicy: {
    eligible: { type: Boolean, default: true },
    duration: { type: Number, default: 30 }
  }
}, { 
  timestamps: true 
});

// Create indexes for better performance
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ "price.original": 1 });
productSchema.index({ tags: 1 });

module.exports = mongoose.model('Product', productSchema);