require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../db');
const requireAuth = require('../middleware/auth'); // <-- ADD THIS

const productRoutes = require('../routes/product');
const userRoutes = require('../routes/user');
const orderRoutes = require('../routes/order');
const reviewRoutes = require('../routes/review');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running"));
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Protected Route (Clerk Auth Required)
app.get("/api/protected", requireAuth(), (req, res) => {
  res.json({ message: "Access granted!", userId: req.auth.userId });
});

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
