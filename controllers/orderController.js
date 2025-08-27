/**
 * @file orderController.js
 * @description Controller for handling order management logic.
 */

const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @description Place a new order.
 * @route POST /api/orders
 * @access Private
 */
exports.placeOrder = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User profile not found in database." });
    }

    const { items, addressIndex, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item." });
    }
    if (user.addresses.length === 0 || !user.addresses[addressIndex]) {
      return res.status(400).json({ message: "Invalid shipping address selected." });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Use a transaction to ensure stock updates and order creation are atomic
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          throw new Error(`Product with ID ${item.product} not found.`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`);
        }

        product.quantity -= item.quantity;
        await product.save({ session });

        orderItems.push({ product: product._id, quantity: item.quantity, price: product.price.original });
        totalAmount += product.price.original * item.quantity;
      }

      const order = new Order({
        user: user._id,
        items: orderItems,
        shippingAddress: user.addresses[addressIndex],
        totalAmount,
        paymentMethod,
        status: 'pending'
      });

      await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      await order.populate([ { path: 'user', select: 'name email' }, { path: 'items.product' } ]);
      res.status(201).json(order);

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      // Re-throw the error to be caught by the outer catch block
      throw error;
    }

  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: error.message || "Error creating order." });
  }
};

/**
 * @description Get orders. If admin, get all orders. If regular user, get their own orders.
 * @route GET /api/orders
 * @access Private
 */
exports.getOrders = async (req, res) => {
  try {
    const { userId, sessionClaims } = req.auth;
    const filter = {};

    // If the user is not an admin, filter orders by their user ID
    if (sessionClaims?.publicMetadata?.role !== 'admin') {
      const user = await User.findOne({ clerkId: userId });
      if (!user) return res.status(404).json({ message: "User profile not found." });
      filter.user = user._id;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: "Error fetching orders." });
  }
};

/**
 * @description Get a single order by its ID.
 * @route GET /api/orders/:orderId
 * @access Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { userId, sessionClaims } = req.auth;

    const order = await Order.findById(orderId)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // If user is not an admin, check if they own the order
    if (sessionClaims?.publicMetadata?.role !== 'admin') {
      const user = await User.findOne({ clerkId: userId });
      if (!user || order.user._id.toString() !== user._id.toString()) {
        return res.status(403).json({ message: "Access denied. You do not own this order." });
      }
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: "Error fetching order details." });
  }
};

/**
 * @description Update the status of an order.
 * @route PUT /api/orders/:orderId/status
 * @access Private (Admin Only)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Here you could add logic to send an email to the user about the status update

    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: "Error updating order status." });
  }
};
