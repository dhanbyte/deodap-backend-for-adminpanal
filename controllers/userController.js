/**
 * @file userController.js
 * @description Controller for user-related operations like profile, address, and wishlist management.
 */

const User = require('../models/User');

/**
 * @description Get the profile of the currently authenticated user.
 * If the user doesn't exist in the local database, it creates a new entry using data from the Clerk token.
 * This acts as a user synchronization mechanism.
 * @route GET /api/user/profile
 * @access Private
 */
exports.getProfile = async (req, res) => {
  try {
    // The user's Clerk ID is available on req.auth.userId from the requireAuth middleware
    const clerkId = req.auth.userId;
    if (!clerkId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    let user = await User.findOne({ clerkId });

    // If the user is not found in our DB, create them
    if (!user) {
      const { firstName, lastName } = req.auth.sessionClaims;
      // The email is available in the claims from the JWT
      const email = req.auth.sessionClaims.email;

      if (!email) {
        return res.status(400).json({ message: 'Email not available in user token. Please ensure email is a public claim in Clerk.' });
      }

      user = new User({
        clerkId,
        name: `${firstName || ''} ${lastName || ''}`.trim(),
        email: email,
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

/**
 * @description Add a new shipping address to the user's profile.
 * @route POST /api/user/address
 * @access Private
 */
exports.addAddress = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    // Basic validation for address fields can be added here
    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ message: 'Address added successfully', addresses: user.addresses });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ message: 'Server error while adding address.' });
  }
};

/**
 * @description Get the user's wishlist, populated with product details.
 * @route GET /api/user/wishlist
 * @access Private
 */
exports.getWishlist = async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const user = await User.findOne({ clerkId }).populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user.wishlist || []);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Server error while fetching wishlist.' });
  }
};

/**
 * @description Add a product to the user's wishlist.
 * @route POST /api/user/wishlist
 * @access Private
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    const clerkId = req.auth.userId;
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $addToSet: { wishlist: productId } }, // Use $addToSet to prevent duplicates
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Server error while updating wishlist.' });
  }
};

/**
 * @description Remove a product from the user's wishlist.
 * @route DELETE /api/user/wishlist/:productId
 * @access Private
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const clerkId = req.auth.userId;

    const user = await User.findOneAndUpdate(
      { clerkId },
      { $pull: { wishlist: productId } }, // Use $pull to remove the item
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Server error while updating wishlist.' });
  }
};

// --- Admin Functions ---

/**
 * @description Get a list of all users.
 * @route GET /api/user
 * @access Private (Admin Only)
 */
exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-addresses -wishlist').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};