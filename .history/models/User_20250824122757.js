const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true, required: true },   // Clerk user id for auth
  name: { type: String },
  email: { type: String, unique: true, required: true },
  addresses: [{
    label: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    phone: String
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
