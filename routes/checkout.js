const router = require('express').Router();
const auth = require('../middleware/auth');
const Coupon = require('../models/Coupon');
const ShippingRule = require('../models/ShippingRule');
const Product = require('../models/Product');

// Calculate totals: items [{productId, quantity}], couponCode, destination {state, city}
router.post('/calculate', auth, async (req, res) => {
  try {
    const { items = [], couponCode, destination = {} } = req.body;

    // Load products and compute subtotal, weight
    const ids = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: ids } });
    let subtotal = 0;
    let totalWeight = 0;
    for (const i of items) {
      const p = products.find(pp => String(pp._id) === String(i.productId));
      if (!p) continue;
      const unit = typeof p.price?.discounted === 'number' && p.price.discounted > 0 ? p.price.discounted : p.price.original;
      subtotal += unit * i.quantity;
      totalWeight += (p.shipping?.weight || 0) * i.quantity;
    }

    // Apply coupon
    let discount = 0;
    if (couponCode) {
      const c = await Coupon.findOne({ code: couponCode, active: true });
      const now = new Date();
      if (c && (!c.startsAt || c.startsAt <= now) && (!c.endsAt || c.endsAt >= now) && subtotal >= (c.minOrderTotal || 0)) {
        discount = c.type === 'percent' ? (subtotal * c.value) / 100 : c.value;
        if (typeof c.maxDiscount === 'number') discount = Math.min(discount, c.maxDiscount);
      }
    }

    // Shipping fee by slab
    let shippingFee = 0;
    const selector = { active: true };
    if (destination.state) selector.state = destination.state;
    if (destination.city) selector.city = destination.city;
    const rules = await ShippingRule.find(selector);
    const rule = rules[0];
    if (rule) {
      if (rule.freeShippingMinTotal && subtotal - discount >= rule.freeShippingMinTotal) {
        shippingFee = 0;
      } else {
        const slab = rule.slabs.find(s => totalWeight >= s.minWeight && totalWeight <= s.maxWeight);
        shippingFee = slab ? slab.price : 0;
      }
    }

    const total = Math.max(0, subtotal - discount) + shippingFee;
    res.json({ subtotal, discount, shippingFee, total });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;


