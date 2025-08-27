const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number,
    price: Number  // Order time की effective price (original/discounted)
  }],
  shippingAddress: {
    label: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    phone: String
  },
  total: Number,
  status: { type: String, default: 'placed' } // placed, shipped, delivered, cancelled
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
