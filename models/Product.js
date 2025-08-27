const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: function() { return "P" + Date.now() + Math.floor(Math.random()*1000); } },
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },

  image: { type: String, required: true },
  extraImages: [{ type: String }],
  video: { type: String },

  quantity: { type: Number, required: true, min: 0 },

  price: { 
    original: { type: Number, required: true, min: 0 },
    discounted: { type: Number, min: 0 },
    currency: { type: String, default: "₹" }
  },

  specifications: {
    material: String,
    size: String,
    height: String,
    width: String,
    weight: String,
    color: String
  },

  shortDescription: { type: String, maxlength: 160 },
  description: { type: String, required: true },

  features: [String],
  tags: [String],

  sku: { type: String, unique: true, sparse: true },

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
  },

  // SEO Fields
  metaTitle: { type: String, trim: true, maxlength: 60 },
  metaDescription: { type: String, trim: true, maxlength: 160 },
  slug: { type: String, unique: true, sparse: true, trim: true }

}, { timestamps: true });

productSchema.index({ name: 1, brand: 1, category: 1, subcategory: 1, tags: 1 });

module.exports = mongoose.model('Product', productSchema);