const User = require('../models/User');
exports.profile = async (req, res) => {
  let user = await User.findOne({ clerkId: req.clerkId });

  // अगर DB में यूज़र नहीं है, तो Clerk के डेटा से नया बनाओ
  if (!user) {
    user = await User.create({
      clerkId: req.clerkId,
      name: req.clerkUser.first_name,
      email: req.clerkUser.email_addresses[0].email_address
    });
  }

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
