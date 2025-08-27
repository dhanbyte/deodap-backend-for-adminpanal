const Affiliate = require('../models/Affiliate');
const AffiliateClick = require('../models/AffiliateClick');
const AffiliateSale = require('../models/AffiliateSale');
const User = require('../models/User');
const Product = require('../models/Product');

// Helper to generate a unique referral code
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// @desc    Register user as an affiliate
// @route   POST /api/affiliates/register
// @access  Private (User)
exports.registerAffiliate = async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found in local DB." });
    }

    let affiliate = await Affiliate.findOne({ userId: user._id });
    if (affiliate) {
      return res.status(400).json({ message: "User is already an affiliate." });
    }

    let referralCode = generateReferralCode();
    while (await Affiliate.findOne({ referralCode })) {
      referralCode = generateReferralCode();
    }

    affiliate = new Affiliate({
      clerkId: req.clerkId,
      userId: user._id,
      referralCode,
    });

    await affiliate.save();
    res.status(201).json({ message: "Affiliate registered successfully", affiliate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get affiliate dashboard data
// @route   GET /api/affiliates/me
// @access  Private (Affiliate)
exports.getAffiliateDashboard = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ clerkId: req.clerkId });
    if (!affiliate) {
      return res.status(404).json({ message: "Affiliate not found." });
    }

    const totalClicks = await AffiliateClick.countDocuments({ affiliate: affiliate._id });
    const totalSales = await AffiliateSale.countDocuments({ affiliate: affiliate._id });
    const recentSales = await AffiliateSale.find({ affiliate: affiliate._id }).sort({ timestamp: -1 }).limit(5).populate('order');

    res.json({
      affiliate,
      totalClicks,
      totalSales,
      recentSales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Track affiliate click
// @route   GET /api/affiliates/track-click
// @access  Public
exports.trackAffiliateClick = async (req, res) => {
  try {
    const { ref, productId } = req.query; // ref is referralCode
    const affiliate = await Affiliate.findOne({ referralCode: ref });

    if (affiliate) {
      const click = new AffiliateClick({
        affiliate: affiliate._id,
        product: productId || null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        referrer: req.headers.referer || null,
      });
      await click.save();
    }
    // Always respond with success to not break user flow, even if affiliate not found
    res.status(200).json({ message: "Click tracked" });
  } catch (error) {
    console.error("Error tracking click:", error);
    res.status(500).json({ message: "Error tracking click" });
  }
};

// @desc    Record affiliate sale (called internally by order placement)
// @access  Internal
exports.recordAffiliateSale = async (affiliateId, orderId, commissionEarned, commissionRate, orderTotal) => {
  try {
    const sale = new AffiliateSale({
      affiliate: affiliateId,
      order: orderId,
      commissionEarned,
      commissionRate,
      orderTotal,
    });
    await sale.save();

    // Update affiliate's earnings
    await Affiliate.findByIdAndUpdate(affiliateId, {
      $inc: { totalEarnings: commissionEarned, pendingEarnings: commissionEarned },
    });
    return sale;
  } catch (error) {
    console.error("Error recording affiliate sale:", error);
    throw error; // Re-throw to be handled by calling function
  }
};

// --- Admin Functions ---

// @desc    Get all affiliates
// @route   GET /api/admin/affiliates
// @access  Private (Admin)
exports.getAllAffiliates = async (req, res) => {
  try {
    const affiliates = await Affiliate.find({}).populate('userId', 'name email');
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update affiliate commission rate
// @route   PUT /api/admin/affiliates/:id/commission
// @access  Private (Admin)
exports.updateAffiliateCommission = async (req, res) => {
  try {
    const { id } = req.params;
    const { commissionRate } = req.body;

    if (typeof commissionRate !== 'number' || commissionRate < 0 || commissionRate > 1) {
      return res.status(400).json({ message: "Commission rate must be a number between 0 and 1." });
    }

    const affiliate = await Affiliate.findByIdAndUpdate(id, { commissionRate }, { new: true });

    if (!affiliate) {
      return res.status(404).json({ message: "Affiliate not found." });
    }

    res.json({ message: "Commission rate updated", affiliate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
