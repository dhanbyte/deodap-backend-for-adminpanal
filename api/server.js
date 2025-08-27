require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../db");
const configureSecurityMiddleware = require("../middleware/security");

const productRoutes = require("../routes/product");
const userRoutes = require("../routes/user");
const orderRoutes = require("../routes/order");
const reviewRoutes = require("../routes/review");
const affiliateRoutes = require("../routes/affiliate");
const auth = require("../middleware/auth");

const couponRoutes = require("../routes/coupon");
const searchRoutes = require("../routes/search");

const app = express();

// सिक्योरिटी मिडलवेयर कॉन्फिगर करें
configureSecurityMiddleware(app);

// बेसिक मिडलवेयर
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => res.send("API running"));
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/affiliates", affiliateRoutes);
app.use("/api/admin", require("../routes/admin"));
app.use("/api/checkout", require("../routes/checkout"));
app.use("/api/coupons", couponRoutes);
app.use("/api/search", searchRoutes);

// Protected ordersRoute (Requires Clerk Token)
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "Access granted!", userId: req.clerkId });
});

// Connect DB & Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
