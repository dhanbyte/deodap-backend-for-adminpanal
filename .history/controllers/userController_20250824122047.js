const User = require('../models/User');
const Product = require('../models/Product');

// Get Profile
exports.getProfile = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// Add address
exports.addAddress = async (req, res) => {
  const { label, address, city, state, pin, phone } = req.body;
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.addresses.push({ label, address, city, state, pin, phone });
  await user.save();
  res.json({ message: 'Address Saved', addresses: user.addresses });
};

// Add to wishlist
exports.addWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) return res.status(404).json({ message: 'User not found' });
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  await user.save();
  res.json({ wishlist: user.wishlist });
};
