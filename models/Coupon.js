const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true, trim: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true, min: 0 },
  minOrderTotal: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  startsAt: { type: Date },
  endsAt: { type: Date },
  active: { type: Boolean, default: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  applicableCategories: [String],
  applicableProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);


