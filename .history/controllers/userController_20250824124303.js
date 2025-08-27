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
