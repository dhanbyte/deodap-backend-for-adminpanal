const User = require('../models/User');

// Profile By ClerkId (Set by auth middleware)
exports.profile = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// Add new address (body: {label,address,city,state,pin,phone})
exports.addAddress = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  user.addresses.push(req.body);
  await user.save();
  res.json({ addresses: user.addresses });
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId }).populate('wishlist');
  res.json(user?.wishlist || []);
};

// Add wishlist
exports.addWishlist = async (req, res) => {
  const { productId } = req.body;
  const user = await User.findOne({ clerkId: req.clerkId });
  if (!user.wishlist.includes(productId)) user.wishlist.push(productId);
  await user.save();
  res.json({ wishlist: user.wishlist });
};

// Remove wishlist
exports.removeWishlist = async (req, res) => {
  const pid = req.params.productId;
  const user = await User.findOne({ clerkId: req.clerkId });
  user.wishlist.pull(pid);
  await user.save();
  res.json({ wishlist: user.wishlist });
};
