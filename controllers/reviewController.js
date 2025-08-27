const ProductReview = require('../models/ProductReview');
const User = require('../models/User');

// Add review (body: { productId, rating, comment })
exports.addReview = async (req, res) => {
  const user = await User.findOne({ clerkId: req.clerkId });
  const { productId, rating, comment } = req.body;
  let already = await ProductReview.findOne({ product: productId, user: user._id });
  if (already) return res.status(400).json({ message: "Already reviewed" });
  const review = await ProductReview.create({ product: productId, user, rating, comment });
  res.status(201).json(review);
};

// List all reviews of a product
exports.listReviews = async (req, res) => {
  const reviews = await ProductReview.find({ product: req.params.productId }).populate('user', 'name');
  res.json(reviews);
};
