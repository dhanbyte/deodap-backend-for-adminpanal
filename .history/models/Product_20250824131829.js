const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // UNIQUE PRODUCT IDs for admin/export/tracking etc.
  id: { type: String, required: true, unique: true },    // e.g., "P001"
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  subcategory: { type: String, trim: true },

  // Images: ONE main image + MULTIPLE extra images standard style
  image: { type: String, required: true },               // Main display image
  extraImages: [{ type: String }],                       // Array of image URLs (extra product views, gallery)

  video: { type: String },                               // Optional product video (url)

  // Main quantities
  quantity: { type: Number, required: true, min: 0 },    // Stock available

  // Pricing details
  price: { 
    original: { type: Number, required: true, min: 0 },
    discounted: { type: Number, min: 0 },
    currency: { type: String, default: "₹" }
  },

  // Product details/tech specs (as flat or nested as needed)
  specifications: {
    material: { type: String },
    size: { type: String },         // e.g. "M", "XL" or "15 inch"
    height: { type: String },       // e.g. "100cm"
    width: { type: String },
    weight: { type: String },       // e.g. "1kg"
    color: { type: String }
  },

  // Description fields
  shortDescription: { type: String, maxlength: 160 },
  description: { type: String, required: true },

  // Useful marketing/search
  features: [String],
  tags: [String],                   // Fast filtering and search

  // Trackable unique code per item in warehouse/inventory
  sku: { type: String, unique: true, sparse: true },      // optional for products without variants

  // Variants: for color/size (each variant can have own price, stock, sku)
  variants: [{
    color: String,
    size: String,
    price: Number,
    quantity: Number,
    sku: String
  }],

  // Delivery/shipping related
  shipping: {
    weight: Number,
    freeShipping: { type: Boolean, default: false }
  },

  // Stock/inventory helpers
  inventory: {
    inStock: { type: Boolean, default: true },
    lowStockThreshold: { type: Number, default: 10 }
  },

  // User reviews & ratings summary for fast display (actual reviews separate model)
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },

  // Product lifecycle/visibility
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'out_of_stock', 'discontinued'], 
    default: 'active' 
  },

  // Return policy for product-page display
  returnPolicy: {
    eligible: { type: Boolean, default: true },
    duration: { type: Number, default: 30 }       // Days
  }

}, { timestamps: true });

// Index for fast search/filter (all important search/filter fields)
productSchema.index({ name: 1, brand: 1, category: 1, subcategory: 1, tags: 1 });

module.exports = mongoose.model('Product', productSchema);
