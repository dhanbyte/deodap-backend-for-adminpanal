const mongoose = require('mongoose');

const affiliateClickSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Optional: if click is for a specific product
  ipAddress: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('AffiliateClick', affiliateClickSchema);
