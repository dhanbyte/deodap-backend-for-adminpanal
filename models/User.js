/**
 * @file User.js
 * @description Defines the Mongoose schema for a User.
 * This model stores user information that is synced from Clerk, as well as application-specific data like addresses and wishlist.
 */

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' }, // e.g., 'Home', 'Work'
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  /**
   * The unique identifier for the user, provided by Clerk.
   * This is the primary key for linking the local user record to the Clerk authentication service.
   */
  clerkId: {
    type: String,
    unique: true,
    required: true,
    index: true, // Index for faster lookups
  },

  /**
   * The user's full name.
   */
  name: {
    type: String,
    trim: true,
  },

  /**
   * The user's primary email address.
   */
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },

  /**
   * An array of shipping addresses saved by the user.
   */
  addresses: [addressSchema],

  /**
   * An array of product IDs that the user has added to their wishlist.
   * Each entry is a reference to a Product document.
   */
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],

  /**
   * The user's role, used for authorization.
   * Can be 'user' or 'admin'. Defaults to 'user'.
   */
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

}, {
  /**
   * Automatically adds `createdAt` and `updatedAt` timestamps to the document.
   */
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);