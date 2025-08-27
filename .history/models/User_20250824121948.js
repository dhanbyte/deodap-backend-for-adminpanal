const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true }, // Clerk id
  name: String,
  email: { type: String, required: true, unique: true },
  addresses: [{
    label: String,
    address: String,
    city: String,
    state: String,
    pin: String,
    phone: String // Phone mandatory for address
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
