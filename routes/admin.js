const router = require('express').Router();
const Coupon = require('../models/Coupon');
const ShippingRule = require('../models/ShippingRule');

// Simple admin password middleware
const adminGuard = (req, res, next) => {
  const header = req.headers['x-admin-key'];
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) return res.status(500).json({ message: 'ADMIN_PASSWORD not configured' });
  if (!header || header !== configured) return res.status(401).json({ message: 'Unauthorized' });
  next();
};

// Coupons CRUD
router.post('/coupons', adminGuard, async (req, res) => {
  try {
    const c = await Coupon.create(req.body);
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/coupons', adminGuard, async (req, res) => {
  const list = await Coupon.find().sort({ createdAt: -1 });
  res.json(list);
});

router.put('/coupons/:id', adminGuard, async (req, res) => {
  const c = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json(c);
});

router.delete('/coupons/:id', adminGuard, async (req, res) => {
  const c = await Coupon.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

// Shipping rules CRUD
router.post('/shipping-rules', adminGuard, async (req, res) => {
  try {
    const rule = await ShippingRule.create(req.body);
    res.status(201).json(rule);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.get('/shipping-rules', adminGuard, async (req, res) => {
  const list = await ShippingRule.find().sort({ createdAt: -1 });
  res.json(list);
});

router.put('/shipping-rules/:id', adminGuard, async (req, res) => {
  const rule = await ShippingRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!rule) return res.status(404).json({ message: 'Not found' });
  res.json(rule);
});

router.delete('/shipping-rules/:id', adminGuard, async (req, res) => {
  const rule = await ShippingRule.findByIdAndDelete(req.params.id);
  if (!rule) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;


