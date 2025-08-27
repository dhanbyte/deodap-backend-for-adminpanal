const mongoose = require('mongoose');

const slabSchema = new mongoose.Schema({
  minWeight: { type: Number, required: true },
  maxWeight: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const shippingRuleSchema = new mongoose.Schema({
  country: { type: String, default: 'IN' },
  state: { type: String },
  city: { type: String },
  slabs: [slabSchema],
  codFee: { type: Number, default: 0 },
  freeShippingMinTotal: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ShippingRule', shippingRuleSchema);


