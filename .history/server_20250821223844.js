require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/product');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use('/api/products', productRoutes);

// Error Handling Middleware (catch all errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Connect MongoDB and start server
const PORT = 5000;

mongoose.connect("mongodb+srv://teeninfluencerteam:nBRn2Zu6NIf2B6YJ@ecommers.uokkp2d.mongodb.net/ecommers?retryWrites=true&w=majority")
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
