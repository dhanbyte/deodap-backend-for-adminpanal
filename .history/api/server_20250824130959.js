require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../db");

const productRoutes = require("../routes/product");
const userRoutes = require("../routes/user");
const orderRoutes = require("../routes/order");
const reviewRoutes = require("../routes/review");
const auth = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API running"));
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);

// Protected Route (Requires Clerk Token)
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "Access granted!", userId: req.clerkId });
});

// Connect DB & Start Server
connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
