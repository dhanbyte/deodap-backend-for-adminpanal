const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  commissionRate: { type: Number, default: 0.05 }, // 5% default commission
  totalEarnings: { type: Number, default: 0 },
  paidEarnings: { type: Number, default: 0 },
  pendingEarnings: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, required: true }, // Short code for links
  status: { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Affiliate', affiliateSchema);
