const mongoose = require('mongoose');

const affiliateSaleSchema = new mongoose.Schema({
  affiliate: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
  commissionEarned: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  orderTotal: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('AffiliateSale', affiliateSaleSchema);
