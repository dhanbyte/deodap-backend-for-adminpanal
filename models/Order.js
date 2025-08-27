/**
 * @file Order.js
 * @description Defines the Mongoose schema for an Order.
 */

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  /**
   * Reference to the User who placed the order.
   */
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  /**
   * An array of items included in the order.
   */
  items: [{
    /**
     * Reference to the Product document.
     */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    /**
     * The quantity of this product ordered.
     */
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    /**
     * The price of the product at the time the order was placed.
     * This is important to keep a historical record of the price paid.
     */
    price: {
      type: Number,
      required: true,
    },
  }],

  /**
   * The shipping address for this specific order.
   * Copied from the user's profile at the time of order.
   */
  shippingAddress: {
    label: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pin: { type: String, required: true },
    phone: { type: String, required: true },
  },

  /**
   * The total calculated amount for the order.
   */
  totalAmount: {
    type: Number,
    required: true,
  },

  /**
   * The current status of the order.
   */
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  /**
   * The payment method chosen by the user.
   */
  paymentMethod: {
    type: String,
    enum: ['COD', 'Online'], // Cash on Delivery or Online Payment
    default: 'COD',
  },

  /**
   * Details about the payment, if applicable.
   */
  paymentDetails: {
    paymentId: String,
    paymentStatus: { type: String, default: 'pending' }, // e.g., pending, completed, failed
  },

}, {
  /**
   * Automatically adds `createdAt` and `updatedAt` timestamps.
   */
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);