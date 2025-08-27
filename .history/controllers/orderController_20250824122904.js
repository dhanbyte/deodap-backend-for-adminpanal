const Order = require('../models/Order');
const User = require('../models/User');

// Place an order
exports.placeOrder = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  const { items, addressIndex } = req.body; // items: [{product,quantity,price}], addressIndex: user ke addresses[अindex]
  if (!Array.isArray(items) || !user.addresses[addressIndex])
    return res.status(400).json({ message: "Invalid data" });
  const address = user.addresses[addressIndex];
  const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const order = new Order({ user, items, shippingAddress: address, total });
  await order.save();
  res.status(201).json(order);
};

// List logged-in user's orders
exports.myOrders = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
  res.json(orders);
};
